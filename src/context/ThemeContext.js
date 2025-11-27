import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={darkMode ? "app dark-mode" : "app"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
