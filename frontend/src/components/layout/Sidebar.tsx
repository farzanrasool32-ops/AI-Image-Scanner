import {
  Clock3,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  ScanLine,
  Settings,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import type { AppView, User } from "../../types/user.types";

type NavItemProps = {
  active: boolean;
  label: string;
  count?: number;
  icon: ReactNode;
  onClick: () => void;
};

function NavItem({ active, label, count, icon, onClick }: NavItemProps) {
  return (
    <button className={`nav-item${active ? " active" : ""}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="nav-badge">{count}</span>
      )}
    </button>
  );
}

export default function Sidebar({
  view,
  user,
  historyCount,
  onNavigate,
  onLogout,
}: {
  view: AppView;
  user: User;
  historyCount: number;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}) {
  return (
    <aside className="sidebar">
      <button
        className="brand"
        onClick={() => onNavigate("overview")}
        aria-label="Go to overview"
      >
        <span className="brand-mark">
          <ScanLine size={21} strokeWidth={2.2} />
        </span>
        <span className="brand-name">
          visio<span>lab</span>
        </span>
      </button>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="main-nav" aria-label="Main navigation">
        <NavItem
          active={view === "overview"}
          icon={<LayoutDashboard size={18} />}
          label="Overview"
          onClick={() => onNavigate("overview")}
        />
        <NavItem
          active={view === "scanner" || view === "results"}
          icon={<ScanLine size={18} />}
          label="Image scanner"
          onClick={() => onNavigate("scanner")}
        />
        <NavItem
          active={view === "history"}
          icon={<Clock3 size={18} />}
          label="Scan history"
          count={historyCount}
          onClick={() => onNavigate("history")}
        />
        <NavItem
          active={view === "assistant"}
          icon={<MessageCircle size={18} />}
          label="Image assistant"
          onClick={() => onNavigate("assistant")}
        />
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-plan">
          <div className="plan-icon">
            <Sparkles size={16} />
          </div>
          <div>
            <strong>Made for discovery</strong>
            <span>AI-powered image insights</span>
          </div>
        </div>
        <NavItem
          active={view === "settings"}
          icon={<Settings size={18} />}
          label="Settings"
          onClick={() => onNavigate("settings")}
        />
        <div className="profile-row">
          <div className="avatar">{user.name.slice(0, 1).toUpperCase()}</div>
          <div className="profile-copy">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <button
            className="icon-button profile-menu"
            aria-label="Sign out"
            onClick={onLogout}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
