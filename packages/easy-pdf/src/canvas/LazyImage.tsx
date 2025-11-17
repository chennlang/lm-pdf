import { memo, useEffect, useRef, useState } from "react";
import { Group, Image, Rect, Text } from "react-konva";

const LazyImage = ({
  src,
  x,
  y,
  width,
  height,
}: {
  src: string | (() => Promise<string>);
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  const [image, setImage] = useState<CanvasImageSource>();
  const imageNode = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadImage() {
    setLoading(true);
    const url = typeof src === "string" ? src : await src();
    const img = new window.Image();
    img.src = url;
    img.addEventListener("load", () => {
      setImage(img);
      setLoading(false);
    });
  }

  useEffect(() => {
    // 滚动时会不断加载此组件，频繁的更新 react 本身会节流掉一部分。不过还是会剩下短时间大量的加载。
    // 这里是再次对，出现时间少于 200 毫秒的组件不加载图片。避免无用 fetch 请求，堵塞实际要加载的图片
    let time = null;
    time = setTimeout(() => {
      loadImage();
    }, 200);

    return () => {
      clearTimeout(time);
    };
  }, []);

  if (loading) {
    return (
      <Group x={x} y={y} width={width} height={height}>
        <Rect x={0} y={0} width={width} height={height} fill={"#fff"}></Rect>
        <Text
          x={0}
          y={0}
          width={width}
          height={height}
          align="center"
          verticalAlign="middle"
          text="页面加载中..."
          fontSize={32}
          fill="#333"
        ></Text>
      </Group>
    );
  }

  return (
    <Image
      alt={src}
      x={x}
      y={y}
      width={width}
      height={height}
      image={image}
      ref={(node) => {
        imageNode.current = node;
      }}
    />
  );
};

export default memo(LazyImage);
