import { useState, useEffect } from "react";

const getSizeByWidth = (width) =>
  width < 1024 ? "S" : width < 1328 ? "M" : "L";

export const useSize = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [height, setHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 0
  );
  const [size, setSize] = useState(
    typeof window !== "undefined" ? getSizeByWidth(window.innerWidth) : "L"
  );

  const listener = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    setSize(getSizeByWidth(window.innerWidth));
  };
  useEffect(() => {
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [width, height, size]);

  return {
    width,
    height,
    size,
  };
};
