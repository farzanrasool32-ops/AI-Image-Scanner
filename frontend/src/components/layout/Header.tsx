import { CircleHelp, LogOut } from "lucide-react";
import type { ApiStatus, AppView, User } from "../../types/user.types";
import ThemeToggle from "../common/ThemeToggle";

const titles: Record<AppView, string> = {
  overview: "Overview",
  scanner: "Image scanner",
  results: "Scan results",
  history: "Scan history",
  assistant: "Image assistant",
  settings: "Settings",
};

function statusLabel(status: ApiStatus) {
  if (status === "ready") return "AI service configured";
  if (status === "needs-config") return "AI key not configured";
  if (status === "unavailable") return "API unavailable";
  return "Checking service…";
}

export default function Header({
  view,
  apiStatus,
  darkMode,
  user,
  authError,
  onToggleTheme,
  onHelp,
  onLogout,
}: {
  view: AppView;
  apiStatus: ApiStatus;
  darkMode: boolean;
  user: User;
  authError: string;
  onToggleTheme: () => void;
  onHelp: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="topbar">
      <div className="breadcrumbs">
        <span>Workspace</span>
        <span className="crumb-slash">/</span>
        <strong>{titles[view]}</strong>
      </div>
      <div className="topbar-actions">
        {authError && (
          <span className="header-auth-error" role="alert">
            {authError}
          </span>
        )}
        <span className="status-pill">
          <span className={`status-dot ${apiStatus}`} />
          {statusLabel(apiStatus)}
        </span>
        <span className="header-user">{user.name}</span>
        <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />
        <button className="help-button" onClick={onHelp}>
          <CircleHelp size={17} /> Help
        </button>
        <button className="logout-button" onClick={onLogout} title="Sign out">
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}
