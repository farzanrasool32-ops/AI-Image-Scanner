import type { ScanColor } from "../../types/scan.types";

export default function ColorAnalysis({ colors }: { colors: ScanColor[] }) {
  return (
    <article className="result-card">
      <div className="result-card-heading">
        <span className="palette-glyph">◉</span>
        <h3>Color palette</h3>
      </div>
      <div className="color-list">
        {colors.map((color, index) => (
          <span
            className="color-swatch"
            key={`${color.hex}-${index}`}
            title={`${color.name} ${color.hex}`}
          >
            <i style={{ backgroundColor: color.hex }} />
            <span>
              {color.name}
              <small>{color.hex}</small>
            </span>
          </span>
        ))}
      </div>
    </article>
  );
}
