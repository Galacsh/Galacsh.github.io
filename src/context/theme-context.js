import React, { createContext, useCallback, useEffect, useState } from "react"
import { getStoredItem, storeItem } from "../utils/storage"

export const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => console.error("'toggleTheme()' not initialized yet."),
})

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const setDarkMode = useCallback(_isDarkMode => {
    storeItem("isDarkMode", _isDarkMode)
    setIsDarkMode(_isDarkMode)
  }, [])

  const toggleTheme = () => {
    setDarkMode(!isDarkMode)
  }

  useEffect(() => {
    // Try to get stored state from localStorage.
    let stored = getStoredItem("isDarkMode")
    if (stored == null) setDarkMode(isDarkMode)
    else setDarkMode(stored)
  }, [setDarkMode])

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
