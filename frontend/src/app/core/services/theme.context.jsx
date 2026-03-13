import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("smartmart-theme")
    return saved || "light"
  })

  useEffect(() => {
    localStorage.setItem("smartmart-theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const themes = {
    light: {
      name: "Light",
      primary: "#667eea",
      secondary: "#764ba2",
      background: "#ffffff",
      surface: "#f8f9fa",
      text: "#333333",
      textSecondary: "#666666",
      border: "#e0e0e0",
      shadow: "rgba(0,0,0,0.1)",
      glass: "rgba(255,255,255,0.8)",
      accent: "#4CAF50"
    },
    dark: {
      name: "Dark",
      primary: "#667eea",
      secondary: "#764ba2",
      background: "#121212",
      surface: "#1e1e1e",
      text: "#ffffff",
      textSecondary: "#b0b0b0",
      border: "#333333",
      shadow: "rgba(0,0,0,0.3)",
      glass: "rgba(30,30,30,0.8)",
      accent: "#4CAF50"
    },
    coffee: {
      name: "Coffee",
      primary: "#8B4513",
      secondary: "#D2691E",
      background: "#2C1810",
      surface: "#3D2418",
      text: "#F5DEB3",
      textSecondary: "#DEB887",
      border: "#8B4513",
      shadow: "rgba(139,69,19,0.2)",
      glass: "rgba(61,36,24,0.9)",
      accent: "#CD853F"
    }
  }

  const currentTheme = themes[theme]

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      themes,
      currentTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}