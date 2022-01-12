import React from "react"
import FloatingButton from "./floating-button"
import MDIcon from "./md-icon"
import { useTheme } from "../../hooks"

const ToggleThemeButton = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <FloatingButton
      top={"1rem"}
      right={"1rem"}
      onClick={() => toggleTheme()}
      onKeyDown={() => toggleTheme()}
      className={"btn btn-round btn-transparent"}
    >
      <div
        className={
          "toggle-theme-btn col justify-content-center align-items-center"
        }
      >
        <MDIcon iconName={isDarkMode ? "weather-sunny" : "weather-night"} />
        <span className={"sr-only"}>Toggle theme</span>
      </div>
    </FloatingButton>
  )
}

export default ToggleThemeButton
