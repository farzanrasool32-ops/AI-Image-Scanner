import {
  ArrowDownToLine,
  ArrowRight,
  Clock3,
  Image as ImageIcon,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import type { ScanRecord } from "../types/scan.types";
import { modeLabel } from "../types/scan.types";
import { formatDate } from "../utils/formatDate";
import Button from "../components/common/Button";

export default function ScanHistory({
  records,
  search,
  onSearchChange,
  onOpen,
  onDelete,
  onExport,
  onScan,
}: {
  records: ScanRecord[];
  search: string;
  onSearchChange: (value: string) => void;
  onOpen: (record: ScanRecord) => void;
  onDelete: (id: string) => void;
  onExport: (format: "json" | "txt") => void;
  onScan: () => void;
}) {
  const filtered = records.filter((record) =>
    `${record.filename} ${record.result.category} ${record.mode}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div className="subpage history-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> YOUR LIBRARY
          </div>
          <h1>Scan history</h1>
          <p>Revisit your image discoveries and keep your insights close.</p>
        </div>
        {records.length > 0 && (
          <div className="export-actions">
            <Button variant="outline" onClick={() => onExport("txt")}>
              <ArrowDownToLine size={15} /> Export TXT
            </Button>
            <Button variant="outline" onClick={() => onExport("json")}>
              <ArrowDownToLine size={15} /> Export JSON
            </Button>
          </div>
        )}
      </div>
      <section className="panel history-panel">
        <div className="history-toolbar">
          <div>
            <strong>
              {filtered.length} {filtered.length === 1 ? "scan" : "scans"}
            </strong>
            <span> saved in this browser</span>
          </div>
          <label className="history-search">
            <Search size={16} />
            <input
              placeholder="Search scans…"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <kbd>⌘ K</kbd>
          </label>
        </div>
        {filtered.length ? (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>ANALYSIS</th>
                  <th>OBJECTS</th>
                  <th>DATE</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <button
                        className="history-file"
                        onClick={() => onOpen(record)}
                      >
                        <span className="history-thumb">
                          <ImageIcon size={17} />
                        </span>
                        <span>
                          <strong>{record.filename}</strong>
                          <small>{record.result.category || "Image"}</small>
                        </span>
                      </button>
                    </td>
                    <td>
                      <span className="table-mode">
                        {modeLabel(record.mode)}
                      </span>
                    </td>
                    <td>
                      <span className="object-count">
                        {record.result.objects.length} found
                      </span>
                    </td>
                    <td className="history-date">
                      {formatDate(record.createdAt)}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="icon-button"
                          onClick={() => onOpen(record)}
                          aria-label={`Open ${record.filename}`}
                        >
                          <ArrowRight size={16} />
                        </button>
                        <button
                          className="icon-button delete-action"
                          onClick={() => onDelete(record.id)}
                          aria-label={`Delete ${record.filename}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="history-empty">
            <div className="empty-icon">
              <Clock3 size={22} />
            </div>
            <strong>
              {records.length ? "No matching scans" : "Your history is waiting"}
            </strong>
            <span>
              {records.length
                ? "Try another search term."
                : "Your completed image analyses will appear here."}
            </span>
            {!records.length && (
              <Button onClick={onScan}>
                <ArrowRight size={15} /> Create a scan
              </Button>
            )}
          </div>
        )}
      </section>
      <p className="local-note">
        <ShieldCheck size={14} /> History is stored locally in this browser.
      </p>
    </div>
  );
}
