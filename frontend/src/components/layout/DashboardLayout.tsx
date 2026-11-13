import type { ReactNode } from "react";
import type { ApiStatus, AppView, User } from "../../types/user.types";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  view,
  user,
  apiStatus,
  authError,
  darkMode,
  historyCount,
  onNavigate,
  onToggleTheme,
  onHelp,
  onLogout,
  children,
}: {
  view: AppView;
  user: User;
  apiStatus: ApiStatus;
  authError: string;
  darkMode: boolean;
  historyCount: number;
  onNavigate: (view: AppView) => void;
  onToggleTheme: () => void;
  onHelp: () => void;
  onLogout: () => void;
  children: ReactNode;
}) {
  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        user={user}
        historyCount={historyCount}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <main className="main-content">
        <Header
          view={view}
          user={user}
          apiStatus={apiStatus}
          authError={authError}
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          onHelp={onHelp}
          onLogout={onLogout}
        />
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
