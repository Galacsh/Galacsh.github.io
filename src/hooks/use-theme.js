import { useContext } from "react";
import { ThemeContext } from "../context/theme-context";

export const useTheme = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  if (isDarkMode == null) console.error("Cannot find 'isDarkMode'.");
  else if (!toggleTheme) console.error("Cannot find toggleTheme().");

  return { isDarkMode, toggleTheme };
};
