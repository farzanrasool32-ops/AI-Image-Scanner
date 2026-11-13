import type { ChangeEvent, DragEvent, RefObject } from "react";
import type { ScanMode } from "../types/scan.types";
import ImageUploader from "../components/scanner/ImageUploader";
import ScanModeSelector from "../components/scanner/ScanModeSelector";
import { ScanProgress, ScanSteps } from "../components/scanner/ScanProgress";

export default function Scanner({
  file,
  previewUrl,
  mode,
  onModeChange,
  isDragging,
  onDragChange,
  fileInput,
  onFileInput,
  onDrop,
  onScan,
  isScanning,
  error,
  onRemoveFile,
}: {
  file: File | null;
  previewUrl: string;
  mode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
  isDragging: boolean;
  onDragChange: (dragging: boolean) => void;
  fileInput: RefObject<HTMLInputElement | null>;
  onFileInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onScan: () => void;
  isScanning: boolean;
  error: string;
  onRemoveFile: () => void;
}) {
  return (
    <div className="subpage scanner-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> IMAGE WORKSPACE
          </div>
          <h1>Start a new scan</h1>
          <p>
            Upload an image and choose the kind of insight you’re looking for.
          </p>
        </div>
      </div>
      <div className="scanner-columns">
        <section className="panel upload-panel">
          <div className="panel-heading">
            <div>
              <h2>Your image</h2>
              <p>Choose an image to get started.</p>
            </div>
            <span className="step-count">
              01 <i /> 02
            </span>
          </div>
          <ImageUploader
            file={file}
            previewUrl={previewUrl}
            isDragging={isDragging}
            inputRef={fileInput}
            onFileInput={onFileInput}
            onDrop={onDrop}
            onDragChange={onDragChange}
            onBrowse={() => fileInput.current?.click()}
            onRemove={onRemoveFile}
          />
        </section>
        <section className="panel mode-panel">
          <div className="panel-heading">
            <div>
              <h2>Choose a scan mode</h2>
              <p>Focus the analysis on what matters to you.</p>
            </div>
          </div>
          <ScanModeSelector mode={mode} onChange={onModeChange} />
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          <ScanProgress
            isScanning={isScanning}
            disabled={!file}
            onScan={onScan}
          />
        </section>
      </div>
      <ScanSteps />
    </div>
  );
}
