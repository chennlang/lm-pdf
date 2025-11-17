'use client';

import React, {
  memo,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Group, Text } from 'react-konva';
import VirtualScrollBar, {
  VirtualScrollBarEmit,
  VirtualScrollBarProps,
} from '../virtual-scroll-bar';
import { useSize } from 'ahooks';
import LazyImage from './LazyImage';
import { PdfRect, CanvasContainerProps, Page, Events } from '../types';
import { PdfContext } from '../context';
import { useRecoilState } from 'recoil';
import { activeViewerRectState, paginationState, scaleState } from '../store';
import { useScaleTools } from '../hooks';

export interface PageItem extends Page {
  src?: string;
  x: number;
  y: number;
  offsetX: number; // 元素偏移 x
  top: number;
  pageIndex: number;
}

function updateYProperty(items: PageItem[]): PageItem[] {
  let totalHeight = 0;

  items.forEach((item) => {
    item.y = totalHeight; // 设置 y 属性为当前总高度
    totalHeight += item.height; // 更新总高度
  });

  return items;
}

function getMaxWidth(pages: Page[]): number {
  let max = 0;
  pages.forEach((page) => {
    if (page.width > max) {
      max = page.width;
    }
  });
  return max;
}

function isGapPageItem(item: PageItem) {
  return item.id.toString().startsWith('gap');
}

function initPageItem(
  pages: Page[],
  containerWidth: number,
  scale: number,
  gap: number
): PageItem[] {
  // 添加 gap 元素
  const result: Page[] = [];
  const maxWidth = getMaxWidth(pages);
  pages.forEach((page, i) => {
    result.push(page);
    result.push({
      width: scale * page.width,
      height: gap || 30,
      id: 'gap' + i,
      page: page.page,
    });
  });

  // 初始化坐标
  let totalHeight = 0;
  let pageIndex = 1;
  return result.map((m) => {
    const item = {
      ...m,
      x: 0,
      y: 0,
      width: scale * m.width,
      height: scale * m.height,
      // 容器比内容宽度大才居中
      offsetX: containerWidth > maxWidth * scale ? (containerWidth - m.width) / 2 : 0,
      top: totalHeight,
      pageIndex,
    };
    totalHeight += scale * m.height;
    if (!m.id.toString().startsWith('gap')) {
      pageIndex += 1;
    }
    return item;
  });
}

/**
 * 对比新旧值，更新 Y 的坐标
 * 滚动的过程中，y 会偏移，新的 items 进来，如果有公共的 items ,要和旧的保持一致。
 * @param oldItems
 * @param newItems
 * @returns
 */
function diffAndUpdateY(oldItems: PageItem[], newItems: PageItem[]): PageItem[] {
  // 找到一个公共的 item
  let flagIndex;
  let flag;
  outerLoop: for (let i = 0; i < oldItems.length; i++) {
    for (let j = 0; j < newItems.length; j++) {
      if (oldItems[i].id === newItems[j].id) {
        flagIndex = j;
        flag = oldItems[i];
        break outerLoop;
      }
    }
  }

  // 基于这个 flag 的位置前后更新 y 的值
  if (flagIndex !== undefined && flag) {
    // 中间赋值
    newItems[flagIndex].y = flag.y;

    // 前序遍历赋值
    let i = flagIndex - 1;
    let count = flag.y || 0;
    while (i > -1) {
      count -= newItems[i].height;
      newItems[i].y = count;
      i -= 1;
    }

    // 后序遍历赋值
    let j = flagIndex + 1;
    let count2 = (flag?.y ?? 0) + flag.height; // 后续 flag.y + flag.height 才是新的起点
    while (j < newItems.length) {
      newItems[j].y = count2;
      count2 += newItems[j].height;
      j += 1;
    }
    return newItems;
  } else {
    return updateYProperty(newItems);
  }
}

const RectItem = ({ item, page }: { item: PdfRect; page: PageItem }) => {
  const pdfContext = useContext(PdfContext);
  const [activeRect, setActiveRect] = useRecoilState(activeViewerRectState);
  const isActive = activeRect?.id === item.id && activeRect.page === page.page;
  const rectRef = useRef<Konva.Rect>(null);

  useEffect(() => {
    if (!isActive || !rectRef.current) return;

    // 重置初始状态
    rectRef.current.scale({ x: 1, y: 1 });

    // 弹跳动画
    const tween1 = new Konva.Tween({
      node: rectRef.current,
      duration: 0.1,
      scaleX: 1.1,
      scaleY: 1.1,
      easing: Konva.Easings.EaseOut,
      onFinish: () => {
        // 第一次缩小
        new Konva.Tween({
          node: rectRef.current!,
          duration: 0.1,
          scaleX: 0.95,
          scaleY: 0.95,
          easing: Konva.Easings.EaseIn,
          onFinish: () => {
            // 第二次放大
            new Konva.Tween({
              node: rectRef.current!,
              duration: 0.1,
              scaleX: 1.05,
              scaleY: 1.05,
              easing: Konva.Easings.EaseOut,
              onFinish: () => {
                // 最后回到原始大小
                new Konva.Tween({
                  node: rectRef.current!,
                  duration: 0.1,
                  scaleX: 1,
                  scaleY: 1,
                  easing: Konva.Easings.EaseIn,
                }).play();
              },
            }).play();
          },
        }).play();
      },
    });

    tween1.play();

    return () => {
      tween1.destroy();
    };
  }, [isActive]);

  return (
    <Rect
      ref={rectRef}
      key={item.id}
      width={item.width}
      height={item.height}
      x={item.x}
      y={item.y}
      stroke={isActive ? '#fa8c16' : item.stroke}
      strokeWidth={isActive ? 4 : item.strokeWidth}
      onClick={() => {
        setActiveRect({
          id: item.id,
          page: page.page,
        });
        pdfContext?.onRectClick?.(item, page);
      }}
    />
  );
};

const RectList = ({ items, page }: { items: PdfRect[]; page: PageItem }) => {
  const [displayRects, setDisplayRects] = useState<PdfRect[]>([]);

  useEffect(() => {
    if (!items.length) return;

    const timer = setTimeout(() => {
      setDisplayRects(items);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [items]);

  return displayRects.map((item) => <RectItem key={item.id} item={item} page={page}></RectItem>);
};

const CanvasContainer = ({ className }: CanvasContainerProps) => {
  const scaleTools = useScaleTools();
  const cachePageRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const virtualScrollBarRef = useRef<VirtualScrollBarEmit>(null);
  const containerSize = useSize(containerRef);
  const pdfContext = useContext(PdfContext);
  const [pagination, setPagination] = useRecoilState(paginationState);
  const [scale, setScale] = useRecoilState(scaleState);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [isAutoScaleDone, setIsAutoScaleDone] = useState(false);
  const [isSetDefaultDone, setIsSetDefaultDone] = useState(false);

  // 所有页面
  const pages = useMemo(() => {
    return initPageItem(pdfContext.pages, containerSize?.width ?? 0, scale, pdfContext.gap);
  }, [pdfContext.pages, containerSize, scale, pdfContext.gap]);

  // 当前显示元素
  const [displayItems, setDisplayItems] = useState<PageItem[]>([]);

  // 页面最大宽度
  const maxPageWidth = useMemo(() => getMaxWidth(pages), [pages]);

  // 滚动到某一页
  function scrollToPage(config: Events['viewerScrollToPage']) {
    const target = pages.find((item) => item.page === config.page);
    if (target) {
      virtualScrollBarRef.current?.scrollTop({
        top: target.top + (config.top ?? 0) * scale,
      });
    }
  }

  // 计算总页码
  useEffect(() => {
    setPagination((old) => ({
      ...old,
      totalPage: pdfContext.pages.filter((page) => !!page.page)?.length ?? 0,
    }));
  }, [pdfContext.pages]);

  // 当前视窗可视元素改变
  function onVisibleItemChange(originItems: VirtualScrollBarProps['items']) {
    const items = originItems as PageItem[];
    // 这里要做一件事，新的 items 会把 y 的坐标全部重新排过，这会有问题，表现为突然弹跳位置。
    // 如果新的 items 中和旧的 items 中有共同的 item, 那么以旧的 item 的 y 为准，保持不变
    // 那么新出现的，排在旧的上面或下面
    startTransition(() => {
      startTransition(() => {
        setDisplayItems((old) => diffAndUpdateY(old, items));
      });
    });

    const targetPage = items.find((m) => !isGapPageItem(m));
    const pageIndex = targetPage?.pageIndex ?? 1;
    /**
     * 页码变化，更新 page
     * cachePageRef 避免重复触发更新 page
     */
    if (cachePageRef.current !== pageIndex) {
      cachePageRef.current = pageIndex;
      setPagination((old) => ({
        ...old,
        currentPage: pageIndex,
      }));
      pdfContext?.onPageChange?.(pdfContext.pages.find((m) => m.id === targetPage!.id));
    }
  }

  const onScroll: VirtualScrollBarProps['onScroll'] = ({ left, top }) => {
    // 整体 y 方向偏移, 这里使用 setData 而不是 setData => old,
    // 因为滚动频繁，利用 setData 更新机制可以做到节流，提升性能
    setDisplayItems((old) =>
      old.map((m) => ({
        ...m,
        y: m.top - top,
      }))
    );
  };

  const onHorizontalScroll: VirtualScrollBarProps['onScroll'] = ({ left, top }) => {
    setOffsetLeft(-left);
  };

  // 获取横向滚动偏移量
  const getItemX = useCallback(
    (item: PageItem) => {
      const cWidth = containerSize?.width ?? 0;
      const centerX = cWidth > item.width ? (cWidth - item.width) / 2 : 0;

      return item.x + centerX + offsetLeft;
    },
    [containerSize, offsetLeft]
  );

  // 获取页面内"块"
  const getBlocks = useCallback(
    (item: PageItem) => {
      const items = pdfContext?.loadPageRectList?.(item) ?? [];
      return items.map((item) => ({
        ...item,
        x: item.x * scale,
        y: item.y * scale,
        width: item.width * scale,
        height: item.height * scale,
      }));
    },
    [scale]
  );

  // 通过事件跳转到目标页面
  useEffect(() => {
    pdfContext.emitter.on('viewerScrollToPage', (config) => {
      scrollToPage(config);
    });
    return () => {
      pdfContext.emitter.off('viewerScrollToPage');
    };
    // 注意：scrollToPage 里依赖 pages，如果不重新更新订阅函数，闭包里取的是旧的 pages
  }, [pdfContext.emitter, pages]);

  // 自动根据父容器计算合适的默认缩放比
  useEffect(() => {
    if (pdfContext.pages.length && containerSize) {
      const containerWidth = containerSize.width >= 1000 ? 1000 : containerSize.width;
      const max = getMaxWidth(pdfContext.pages);
      setScale(scaleTools.getScaleInOption(containerWidth / max));
      setIsAutoScaleDone(true);
    }
  }, [pdfContext.pages, containerSize]);

  // 默认页码
  useEffect(() => {
    if (pdfContext.defaultPage && isAutoScaleDone) {
      scrollToPage({
        page: pdfContext.defaultPage,
      });
      setIsSetDefaultDone(true);
    }
  }, [pdfContext.defaultPage, isAutoScaleDone]);

  // 缩放改变后，保持页面位置不变
  useEffect(() => {
    if (isSetDefaultDone) {
      scrollToPage({
        page: pagination.currentPage,
      });
    }
  }, [scale]);

  return (
    <div
      className={className}
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Stage width={containerSize?.width} height={containerSize?.height}>
        {/* 背景层 */}
        <Layer>
          {displayItems.map((item) => {
            if (isGapPageItem(item)) {
              return (
                <Group
                  key={item.id}
                  width={item.width}
                  height={item.height}
                  x={getItemX(item)}
                  y={item.y || 0}
                >
                  <Rect width={item.width} height={item.height} x={0} y={0}></Rect>
                  <Text
                    width={item.width}
                    height={item.height}
                    x={0}
                    y={0}
                    align="center"
                    verticalAlign="middle"
                    fill="#666"
                    text={item.page + ''}
                  ></Text>
                </Group>
              );
            }
            return (
              <Group
                key={item.id}
                width={item.width}
                height={item.height}
                offsetX={1}
                x={getItemX(item)}
                y={item.y || 0}
              >
                <LazyImage
                  src={item.src || (() => pdfContext.loadPageImage(item))}
                  width={item.width}
                  height={item.height}
                  x={0}
                  y={0}
                ></LazyImage>
              </Group>
            );
          })}
        </Layer>
        {/* blocks 层 */}
        <Layer>
          {displayItems
            .filter((m) => !isGapPageItem(m))
            .map((item) => (
              <Group
                key={item.id}
                width={item.width}
                height={item.height}
                x={getItemX(item)}
                y={item.y || 0}
              >
                <RectList page={item} items={getBlocks(item)}></RectList>
              </Group>
            ))}
        </Layer>
      </Stage>
      <VirtualScrollBar
        ref={virtualScrollBarRef}
        direction="vertical"
        items={pages}
        onVisibleItemChange={onVisibleItemChange}
        onScroll={onScroll}
      ></VirtualScrollBar>
      <VirtualScrollBar
        direction="horizontal"
        items={[{ id: 'none', height: maxPageWidth }]}
        onScroll={onHorizontalScroll}
      ></VirtualScrollBar>
    </div>
  );
};

export default memo(CanvasContainer);
