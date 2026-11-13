import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({
  darkMode,
  onToggle,
}: {
  darkMode: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="icon-button theme-button"
      aria-label={`Switch to ${darkMode ? "light" : "dark"} theme`}
      onClick={onToggle}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
