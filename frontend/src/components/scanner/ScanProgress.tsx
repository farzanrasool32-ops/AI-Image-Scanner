import { ArrowRight, Sparkles } from "lucide-react";
import Loader from "../common/Loader";

export function ScanProgress({
  isScanning,
  disabled,
  onScan,
}: {
  isScanning: boolean;
  disabled: boolean;
  onScan: () => void;
}) {
  return (
    <>
      <button
        className="button button-primary scan-submit"
        onClick={onScan}
        disabled={disabled || isScanning}
      >
        {isScanning ? (
          <Loader label="Analyzing image…" />
        ) : (
          <>
            <Sparkles size={17} /> Analyze image <ArrowRight size={16} />
          </>
        )}
      </button>
      <div className="scan-footnote">Usually takes around 10–20 seconds</div>
    </>
  );
}

export function ScanSteps() {
  return (
    <div className="process-strip">
      <span>
        <i>1</i> Upload your image
      </span>
      <ArrowRight size={14} />
      <span>
        <i>2</i> AI studies the details
      </span>
      <ArrowRight size={14} />
      <span>
        <i>3</i> Explore your results
      </span>
    </div>
  );
}
