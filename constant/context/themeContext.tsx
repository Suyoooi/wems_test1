import React, { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  try {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error("error");
    }
    return context;
  } catch (error) {
    console.error("ThemeContext 에러:", error);
    return { isDarkMode: false, toggleTheme: () => {} };
  }
};
