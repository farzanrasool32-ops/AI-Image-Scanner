import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  FileImage,
  MessageCircle,
  Plus,
  Sparkles,
} from "lucide-react";
import type { ScanRecord } from "../types/scan.types";
import { modeLabel } from "../types/scan.types";
import { formatDate } from "../utils/formatDate";
import ColorAnalysis from "../components/analysis/ColorAnalysis";
import ObjectAnalysis from "../components/analysis/ObjectAnalysis";
import OCRResults from "../components/analysis/OCRResults";
import ProductAnalysis from "../components/analysis/ProductAnalysis";
import QualityAnalysis from "../components/analysis/QualityAnalysis";
import SceneAnalysis from "../components/analysis/SceneAnalysis";
import Button from "../components/common/Button";

export default function ScanResults({
  record,
  onBack,
  onNewScan,
  onAssistant,
  onPdf,
  error,
}: {
  record: ScanRecord;
  onBack: () => void;
  onNewScan: () => void;
  onAssistant: () => void;
  onPdf: () => void;
  error: string;
}) {
  const analysis = record.result;
  return (
    <div className="subpage results-page">
      <div className="results-toolbar">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>
        <span className="result-breadcrumb">
          Scan results <i /> {formatDate(record.createdAt)}
        </span>
        <Button variant="outline" onClick={onPdf}>
          <ArrowDownToLine size={16} /> Download PDF
        </Button>
      </div>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <div className="page-intro">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> ANALYSIS COMPLETE
          </div>
          <h1>{record.filename}</h1>
          <p>
            {modeLabel(record.mode)} · {formatDate(record.createdAt)}
          </p>
        </div>
      </div>
      <section className="result-summary">
        <div className="summary-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <span className="summary-label">AI OVERVIEW</span>
          <p>{analysis.description}</p>
        </div>
        <div className="category-chip">
          {analysis.category || "Image analysis"}
        </div>
      </section>
      <div className="result-grid">
        <ObjectAnalysis objects={analysis.objects} />
        <SceneAnalysis
          scene={analysis.scene}
          background={analysis.background}
        />
        <OCRResults
          text={analysis.extractedText}
          documentType={analysis.documentType}
        />
        <ProductAnalysis products={analysis.products} />
        <ColorAnalysis colors={analysis.colors} />
        <QualityAnalysis quality={analysis.quality} />
      </div>
      <section className="next-step-card">
        <div className="next-icon">
          <MessageCircle size={19} />
        </div>
        <div>
          <strong>Curious about something specific?</strong>
          <span>
            Ask follow-up questions about this image with your AI assistant.
          </span>
        </div>
        <Button onClick={onAssistant}>
          Chat about image <ArrowRight size={15} />
        </Button>
      </section>
      <button className="text-button new-scan-link" onClick={onNewScan}>
        <Plus size={16} /> Start another scan
      </button>
    </div>
  );
}

export function EmptyResults({ onAction }: { onAction: () => void }) {
  return (
    <div className="standalone-empty">
      <div className="empty-icon">
        <FileImage size={22} />
      </div>
      <h2>No scan selected</h2>
      <p>Start a new scan to see your image analysis.</p>
      <Button onClick={onAction}>
        <Plus size={16} /> Start a scan
      </Button>
    </div>
  );
}
