import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import "./index.css";
import { useScroll, useSize } from "ahooks";

interface Item {
  id: string | number;
  height: number;
  [k: string]: any;
}

interface ScrollConfig {
  top?: number;
  left?: number;
}

/**
 * 返回在可视容器中的 items
 * @param param0 config
 * @returns items
 */
function getVisibleItems({
  items,
  scrollTop,
  containerHeight,
}: {
  items: Item[];
  scrollTop: number;
  containerHeight: number;
}) {
  const result: Item[] = [];
  let currentHeight = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    currentHeight += item.height;

    // 检查当前 item 是否在可视区域内
    if (
      currentHeight > scrollTop &&
      currentHeight - item.height < scrollTop + containerHeight
    ) {
      result.push(item);
    }

    // 如果当前 item 的底部已经超出了可视区域，停止循环
    if (currentHeight > scrollTop + containerHeight) {
      break;
    }
  }

  return result;
}

/**
 * 对比两个 items 相同
 * @param items1
 * @param items2
 * @returns boolean
 */
function isSameItems(items1: Item[], items2: Item[]) {
  if (items1.length !== items2.length) return false;
  const set1 = new Set(items1.map((m) => m.id));
  const set2 = new Set(items2.map((m) => m.id));
  if (set1.size !== set2.size) return false;
  for (const item of set1) {
    if (!set2.has(item)) {
      return false;
    }
  }
  return true;
}

export interface VirtualScrollBarProps {
  direction: "vertical" | "horizontal";
  items: Item[];
  scrollTo?: ScrollConfig;
  onVisibleItemChange?: (items: Item[]) => void;
  onScroll?: (scroll: { left: number; top: number }) => void;
}

export interface VirtualScrollBarEmit {
  scrollTop: (target: ScrollConfig) => void;
}

const VirtualScrollBar = forwardRef<
  VirtualScrollBarEmit,
  VirtualScrollBarProps
>(
  (
    {
      direction = "vertical",
      items = [],
      scrollTo,
      onVisibleItemChange,
      onScroll,
    },
    ref
  ) => {
    const divRef = useRef<HTMLDivElement>(null);
    const currenItems = useRef<Item[]>([]);
    const size = useSize(divRef);
    const scroll = useScroll(divRef);

    useImperativeHandle(ref, () => ({
      scrollTop: (target) => {
        divRef.current?.scrollTo({
          ...scroll,
          ...target,
        });
      },
    }));

    function handleUpdateVisibleItems(diff = true) {
      if (!size || !items.length) return;
      const viewItems = getVisibleItems({
        items,
        scrollTop: scroll?.top || 0,
        containerHeight:
          direction === "vertical" ? size?.height || 0 : size?.width || 0,
      });

      // 对比旧值，有更新才触发
      if (diff && isSameItems(viewItems, currenItems.current)) {
        return;
      }

      currenItems.current = viewItems;
      onVisibleItemChange?.(viewItems);
    }

    // 手动控制滚动距离
    useEffect(() => {
      if (divRef.current && scrollTo) {
        divRef.current.scrollTo(scrollTo);
      }
    }, [divRef, scrollTo]);

    // 容器尺寸更新后
    // currenItems 存的旧数据对比已经没有意义，因为 items 已经更新，currenItems 存的还是旧值，对比会出现问题
    useEffect(() => {
      handleUpdateVisibleItems(false);
    }, [size, items]);

    // 滚动更新
    useEffect(() => {
      handleUpdateVisibleItems();
      onScroll?.(scroll ?? { left: 0, top: 0 });
    }, [scroll]);

    useEffect(() => {
      if (divRef.current && divRef.current.parentElement) {
        function handleWheel(event: WheelEvent) {
          event.preventDefault();
          // 水平
          if (direction === "horizontal" && event.shiftKey) {
            const left = (divRef.current?.scrollLeft ?? 0) + event.deltaX;
            divRef.current?.scrollTo({
              left,
            });
          }
          // 垂直
          if (direction === "vertical") {
            const top = (divRef.current?.scrollTop ?? 0) + event.deltaY;
            divRef.current?.scrollTo({
              top,
            });
          }
        }
        divRef.current.parentElement.addEventListener("wheel", handleWheel);
        return () => {
          divRef.current?.parentElement?.removeEventListener(
            "wheel",
            handleWheel
          );
        };
      }
    }, []);

    const styles = useMemo(() => {
      if (direction === "vertical") {
        return {
          height: items.reduce((sum, item) => (sum += item.height), 0),
        };
      } else {
        return {
          width: items.reduce((sum, item) => (sum += item.height), 0),
        };
      }
    }, [direction, items]);

    return (
      <div ref={divRef} className={`v-scroll-bar ${direction}`}>
        <div style={styles}></div>
      </div>
    );
  }
);

VirtualScrollBar.displayName = "VirtualScrollBar";
export default memo(VirtualScrollBar);
