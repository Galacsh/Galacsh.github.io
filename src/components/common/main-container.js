import React from "react"

const MainContainer = ({ children, className = "" }) => (
  <div className={`container ${className}`}>
    <div>{children}</div>
  </div>
)

export default MainContainer
