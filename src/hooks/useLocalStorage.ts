import { useState, useEffect } from "react";

/**
 * Drop-in replacement for useState that syncs to localStorage.
 * Reads once on mount; writes on every change.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or private mode — degrade silently
    }
  }, [key, value]);

  return [value, setValue];
}
