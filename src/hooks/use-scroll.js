import { useState, useEffect, useCallback } from "react";

const scrollTo = (y) => {
  if (typeof window !== "undefined") window.scrollTo(0, y);
};
const scrollTop = () => scrollTo(0);
const scrollBottom = () =>
  scrollTo(
    typeof window !== "undefined" ? window.document.body.scrollHeight : 999999
  );
const calculateScrollPercentage = () => {
  if (typeof window !== "undefined") {
    let scrollY = window.scrollY;
    let scrollHeight = window.document.body.scrollHeight;
    let innerHeight = window.innerHeight;
    let maxScrollY = scrollHeight - innerHeight;

    if (maxScrollY === 0) return 100;
    else if (maxScrollY < 0) return 0;
    else {
      let result = ((scrollY / maxScrollY) * 100).toFixed(2);
      return isFinite(result) ? result : 0;
    }
  }
  return 0;
};

export const useScroll = () => {
  const [state, setState] = useState(
    typeof window !== "undefined"
      ? {
          x: window.scrollX,
          y: window.scrollY,
          scrolledUp: false,
          scrollPercentage: calculateScrollPercentage(),
        }
      : {
          x: 0,
          y: 0,
          scrolledUp: false,
          scrollPercentage: 0,
        }
  );

  const onScroll = useCallback(() => {
    setState({
      x: window.scrollX,
      y: window.scrollY,
      scrolledUp: window.scrollY < state.y,
      scrollPercentage: calculateScrollPercentage(),
    });
  }, [state]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll); // scorll할 때 onScroll 이벤트 핸들러 지정
    return () => window.removeEventListener("scroll", onScroll); // clean up
  }, [state, onScroll]);

  return {
    scrolledUp: state.scrolledUp,
    scrollTop,
    scrollBottom,
    scrollPercentage: state.scrollPercentage,
  };
};
