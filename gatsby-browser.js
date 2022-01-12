import "@fontsource/ibm-plex-sans/400.css"
import "@fontsource/ibm-plex-sans/500.css"
import "@fontsource/ibm-plex-sans/600.css"
import "@fontsource/ibm-plex-sans/700.css"
import "@fontsource/jetbrains-mono/500.css"
import "@fontsource/jetbrains-mono/700.css"
import "@fontsource/noto-sans-kr/400.css"
import "@fontsource/noto-sans-kr/500.css"
import "@fontsource/noto-sans-kr/700.css"
import "@mdi/font/css/materialdesignicons.css"
import "./src/styles/main.scss"

import React from "react"
import { ThemeProvider } from "./src/context/theme-context"

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)
