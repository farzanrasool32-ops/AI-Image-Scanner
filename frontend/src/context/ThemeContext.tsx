import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext } from '../hooks/useTheme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('image-scanner-theme') === 'dark')
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    localStorage.setItem('image-scanner-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])
  const value = useMemo(() => ({ darkMode, toggleTheme: () => setDarkMode((value) => !value) }), [darkMode])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}