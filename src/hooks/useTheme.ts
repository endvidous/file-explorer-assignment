import { useEffect } from "react";
import type { Theme } from "../types";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Returns [currentTheme, toggleTheme].
 * Adds/removes the 'dark' class on <html> so Tailwind picks it up.
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useLocalStorage<Theme>("fe-theme", "dark");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return [theme, toggle];
}
