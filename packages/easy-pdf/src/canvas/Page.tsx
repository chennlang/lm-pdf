import { memo } from "react";
import { Rect } from "react-konva";

const Page = ({
  x,
  y,
  width,
  height,
  children,
}: {
  children: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  return <Rect x={x} y={y} width={width} height={height} />;
};

export default memo(Page);
