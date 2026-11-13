import { FileText, Image as ImageIcon, Search, Sparkles } from "lucide-react";
import type { ScanMode } from "../../types/scan.types";
import { scanModes } from "../../types/scan.types";

const icons = [Sparkles, FileText, Search, ImageIcon];

export default function ScanModeSelector({
  mode,
  onChange,
}: {
  mode: ScanMode;
  onChange: (mode: ScanMode) => void;
}) {
  return (
    <div className="mode-options">
      {scanModes.map((item, index) => {
        const Icon = icons[index];
        return (
          <button
            key={item.id}
            className={`mode-option${mode === item.id ? " selected" : ""}`}
            onClick={() => onChange(item.id)}
          >
            <span className={`mode-icon mode-${index}`}>
              <Icon size={17} />
            </span>
            <span className="mode-copy">
              <strong>{item.title}</strong>
              <span>{item.caption}</span>
            </span>
            <span className="radio-dot">{mode === item.id && <i />}</span>
          </button>
        );
      })}
    </div>
  );
}
