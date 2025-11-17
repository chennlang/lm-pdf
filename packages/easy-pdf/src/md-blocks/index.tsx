import React, { memo, useEffect, useState } from "react";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import "./index.css";
import { EasyBlocksProps } from "../types";
import MdItem from "./md-item";

// 主列表组件
const EasyBlocks: React.FC<EasyBlocksProps> = ({
  items,
  scrollToIndex,
  onBlockClick,
  blockType = "text",
  editable = true,
  beforeCopy = (content: string) => content,
  onChange = () => {},
}) => {
  const [scrollIndex, setScrollIndex] = useState<number | undefined>();

  useEffect(() => {
    setScrollIndex(scrollToIndex);
  }, [scrollToIndex]);

  // 创建 CellMeasurerCache
  const cache = new CellMeasurerCache({
    defaultHeight: 50, // 默认高度
    fixedWidth: true, // 宽度固定
    minHeight: 30, // 最小高度
  });

  // 渲染每一项
  const rowRenderer = ({ index, key, parent, style }: any) => {
    const item = items[index];
    const handleClick = () => {};

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure }) => (
          <div style={style}>
            <MdItem
              editable={editable}
              index={index}
              item={item}
              blockType={blockType}
              onClick={handleClick}
              beforeCopy={beforeCopy}
              onChange={onChange}
            />
          </div>
        )}
      </CellMeasurer>
    );
  };

  return (
    <AutoSizer className="easy-block-list">
      {({ height, width }) => (
        <List
          width={width}
          height={height}
          deferredMeasurementCache={cache} // 使用 CellMeasurerCache
          rowCount={items.length}
          rowHeight={cache.rowHeight} // 使用缓存的高度
          rowRenderer={rowRenderer}
          scrollToIndex={scrollIndex} // 滚动到特定行
        />
      )}
    </AutoSizer>
  );
};

export default memo(EasyBlocks);
