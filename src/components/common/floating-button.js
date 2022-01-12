import React from "react"

const FloatingButton = ({
  top,
  right,
  bottom,
  left,
  children,
  className,
  onClick,
  onKeyDown,
}) => {
  return (
    <div
      className={className + " pos-fixed"}
      style={{
        top: top || null,
        right: right || null,
        bottom: bottom || null,
        left: left || null,
      }}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  )
}

export default FloatingButton
