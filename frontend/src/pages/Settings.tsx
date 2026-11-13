import { ShieldCheck, Sun } from "lucide-react";
import Button from "../components/common/Button";

export default function Settings({
  darkMode,
  onToggleTheme,
  historyCount,
  onExport,
}: {
  darkMode: boolean;
  onToggleTheme: () => void;
  historyCount: number;
  onExport: (format: "json" | "txt") => void;
}) {
  return (
    <div className="subpage settings-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> PREFERENCES
          </div>
          <h1>Settings</h1>
          <p>Make your workspace feel like yours.</p>
        </div>
      </div>
      <div className="settings-sections">
        <section className="panel settings-panel">
          <div className="settings-heading">
            <span className="settings-icon">
              <Sun size={17} />
            </span>
            <div>
              <h2>Appearance</h2>
              <p>Choose how VisioLab looks on this device.</p>
            </div>
          </div>
          <div className="settings-row">
            <div>
              <strong>Dark theme</strong>
              <span>Switch between light and dark mode.</span>
            </div>
            <button
              className={`switch${darkMode ? " on" : ""}`}
              role="switch"
              aria-checked={darkMode}
              aria-label="Toggle dark theme"
              onClick={onToggleTheme}
            >
              <i />
            </button>
          </div>
        </section>
        <section className="panel settings-panel">
          <div className="settings-heading">
            <span className="settings-icon">
              <ShieldCheck size={17} />
            </span>
            <div>
              <h2>Your data</h2>
              <p>
                Scan history is saved in this browser and stays under your
                control.
              </p>
            </div>
          </div>
          <div className="settings-row">
            <div>
              <strong>Saved scans</strong>
              <span>
                {historyCount} {historyCount === 1 ? "record" : "records"}{" "}
                stored locally on this device.
              </span>
            </div>
            <div className="export-actions">
              <Button
                variant="outline"
                size="small"
                onClick={() => onExport("txt")}
                disabled={!historyCount}
              >
                Export TXT
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={() => onExport("json")}
                disabled={!historyCount}
              >
                Export JSON
              </Button>
            </div>
          </div>
        </section>
        <div className="settings-footnote">
          <ShieldCheck size={15} />
          <span>
            Your uploaded images are sent securely to the configured AI service
            for analysis. They are not retained by this app.
          </span>
        </div>
      </div>
    </div>
  );
}
