import React from "react"
import { useScroll } from "../../hooks"

const ScrollIndicator = () => {
  const { scrollPercentage } = useScroll(0)

  return (
    <div className={"pos-fixed scroll-indicator"}>
      <div style={{ width: scrollPercentage + "%" }}></div>
      <span className={"sr-only"}>Scroll Percentage Indicator</span>
    </div>
  )
}

export default ScrollIndicator
