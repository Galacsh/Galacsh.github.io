import React from "react"
import FloatingButton from "./floating-button"
import MDIcon from "./md-icon"
import { useScroll } from "../../hooks"

const FastScrollButton = () => {
  const { scrollBottom, scrollTop, scrolledUp } = useScroll()

  return (
    <FloatingButton
      bottom={"1rem"}
      right={"1rem"}
      onClick={() => (scrolledUp ? scrollTop() : scrollBottom())}
      onKeyDown={() => (scrolledUp ? scrollTop() : scrollBottom())}
      className={"btn btn-round btn-transparent"}
    >
      <div
        className={
          "fast-scroll-btn col justify-content-center align-items-center"
        }
      >
        <MDIcon iconName={scrolledUp ? "arrow-up-thin" : "arrow-down-thin"} />
        <span className={"sr-only"}>Fast scroll</span>
      </div>
    </FloatingButton>
  )
}

export default FastScrollButton
