import {
  ArrowRight,
  Check,
  FileImage,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ScanRecord } from "../types/scan.types";
import { modeLabel } from "../types/scan.types";
import { formatDate } from "../utils/formatDate";
import Button from "../components/common/Button";

function StatCard({
  icon,
  label,
  value,
  note,
  tint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  tint: string;
}) {
  return (
    <article className="stat-card">
      <span className={`stat-icon ${tint}`}>{icon}</span>
      <div>
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        <span className="stat-note">{note}</span>
      </div>
      <span className="stat-spark">↗</span>
    </article>
  );
}

function RecentItem({
  record,
  onClick,
}: {
  record: ScanRecord;
  onClick: () => void;
}) {
  return (
    <button className="recent-item" onClick={onClick}>
      <span className="recent-thumb">
        <ImageIcon size={19} />
      </span>
      <span className="recent-name">
        <strong>{record.filename}</strong>
        <span>
          {record.result.category || "Image"} <i />{" "}
          {record.result.objects.length} objects identified
        </span>
      </span>
      <span className="recent-mode">{modeLabel(record.mode)}</span>
      <span className="recent-date">{formatDate(record.createdAt)}</span>
      <ArrowRight className="recent-arrow" size={16} />
    </button>
  );
}

export default function Dashboard({
  history,
  onScan,
  onHistory,
  onOpen,
  onAssistant,
}: {
  history: ScanRecord[];
  onScan: () => void;
  onHistory: () => void;
  onOpen: (record: ScanRecord) => void;
  onAssistant: () => void;
}) {
  const totalObjects = history.reduce(
    (sum, record) => sum + record.result.objects.length,
    0,
  );
  const latest = history.slice(0, 4);
  return (
    <div className="overview-page">
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> YOUR IMAGE INTELLIGENCE WORKSPACE
          </div>
          <h1>See more in every image.</h1>
          <p>Turn visual information into clear, useful insights with AI.</p>
        </div>
        <Button onClick={onScan}>
          <span className="button-icon">
            <ScanLine size={17} />
          </span>{" "}
          New scan
        </Button>
      </section>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-kicker">
            <WandSparkles size={14} /> YOUR AI IMAGE STUDIO
          </span>
          <h2>
            Every detail.
            <br />
            <span>Within reach.</span>
          </h2>
          <p>
            Understand the objects, text, products and stories hiding in your
            images.
          </p>
          <div className="hero-buttons">
            <Button variant="lime" onClick={onScan}>
              Start analyzing <ArrowRight size={16} />
            </Button>
            <button className="hero-link" onClick={onAssistant}>
              Ask about an image <MessageCircle size={15} />
            </button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-glow" />
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-image">
            <div className="art-sun" />
            <div className="art-mountain mountain-back" />
            <div className="art-mountain mountain-front" />
            <div className="art-water" />
            <span className="art-scan-line" />
          </div>
          <span className="art-label label-one">
            <Sparkles size={13} /> Scene identified
          </span>
          <span className="art-label label-two">
            <Check size={13} /> 8 objects found
          </span>
          <span className="art-pin pin-one" />
          <span className="art-pin pin-two" />
          <span className="art-pin pin-three" />
        </div>
        <div className="hero-grid" />
      </section>
      <section className="stats-grid">
        <StatCard
          icon={<ScanLine size={18} />}
          label="Images analyzed"
          value={history.length.toString()}
          note="Your total scans"
          tint="violet"
        />
        <StatCard
          icon={<ImageIcon size={18} />}
          label="Objects recognized"
          value={totalObjects.toString()}
          note="Across all your scans"
          tint="blue"
        />
        <StatCard
          icon={<FileText size={18} />}
          label="Text extracted"
          value={history
            .filter((record) => record.result.extractedText.trim())
            .length.toString()}
          note="Scans with readable text"
          tint="amber"
        />
        <StatCard
          icon={<ShieldCheck size={18} />}
          label="Workspace status"
          value="Ready"
          note="Your images stay yours"
          tint="green"
        />
      </section>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Recent scans</h2>
            <p>Your latest image discoveries, all in one place.</p>
          </div>
          <button className="text-button" onClick={onHistory}>
            View all <ArrowRight size={15} />
          </button>
        </div>
        {latest.length ? (
          <div className="recent-list">
            {latest.map((record) => (
              <RecentItem
                key={record.id}
                record={record}
                onClick={() => onOpen(record)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-recent">
            <span className="empty-icon">
              <FileImage size={23} />
            </span>
            <strong>Your first discovery starts here</strong>
            <span>Upload an image to see the details AI can uncover.</span>
            <button className="text-button" onClick={onScan}>
              Create your first scan <ArrowRight size={15} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
