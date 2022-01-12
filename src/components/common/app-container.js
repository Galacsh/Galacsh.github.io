import React from "react"
import { useSize } from "../../hooks"

const AppContainer = ({ children }) => {
  const { width, height } = useSize()

  return (
    <div
      style={{
        minWidth: width > 160 ? `calc(${width}px - 2rem)` : "160px",
        minHeight: height != null && height > 0 ? height : "100vh",
      }}
      className={"app"}
    >
      {children}
    </div>
  )
}

export default AppContainer
