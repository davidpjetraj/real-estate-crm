"use client";

import { IconButton, Tooltip } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "@/lib/theme";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import React, { useState, createContext, useContext, ReactNode } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function CustomThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme-mode");
      return saved === "dark";
    }
    return true; // default to dark mode
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme-mode", newMode ? "dark" : "light");
      // Add or remove dark class to html element for Tailwind CSS
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Set initial dark class on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDarkMode]);

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default function ThemeSwitcher() {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <Tooltip
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <IconButton onClick={toggleTheme} color="inherit">
        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
