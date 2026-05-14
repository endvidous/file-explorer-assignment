import { Sun, Moon } from "lucide-react";
import type { Theme } from "../types";

interface Props {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className={`
        relative w-8 h-8 flex items-center justify-center rounded-md
        transition-all duration-200 active:scale-90
        text-[var(--text-muted)] hover:text-[var(--text)]
        hover:bg-[var(--hover)]
      `}
    >
      {/* Sun and moon swap with a rotate-and-fade */}
      <span
        className={`absolute transition-all duration-300 ${
          theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
        }`}
      >
        <Sun size={15} />
      </span>
      <span
        className={`absolute transition-all duration-300 ${
          theme === "light" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
        }`}
      >
        <Moon size={15} />
      </span>
    </button>
  );
}
