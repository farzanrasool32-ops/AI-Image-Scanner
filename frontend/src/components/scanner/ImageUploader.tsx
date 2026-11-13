import { CloudUpload, ShieldCheck } from "lucide-react";
import type { ChangeEvent, DragEvent, RefObject } from "react";
import type { ImageFileInfo } from "../../types/image.types";
import ImagePreview from "./ImagePreview";

const accept = "image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff";

export default function ImageUploader({
  file,
  previewUrl,
  isDragging,
  inputRef,
  onFileInput,
  onDrop,
  onDragChange,
  onBrowse,
  onRemove,
}: {
  file: ImageFileInfo | null;
  previewUrl: string;
  isDragging: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onFileInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragChange: (dragging: boolean) => void;
  onBrowse: () => void;
  onRemove: () => void;
}) {
  const size = file
    ? file.size < 1024 * 1024
      ? `${Math.max(1, Math.round(file.size / 1024))} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : "";
  return (
    <>
      {file ? (
        <ImagePreview
          previewUrl={previewUrl}
          file={file}
          size={size}
          onRemove={onRemove}
        />
      ) : (
        <div
          className={`drop-zone${isDragging ? " is-dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            onDragChange(true);
          }}
          onDragLeave={() => onDragChange(false)}
          onDrop={onDrop}
          onClick={onBrowse}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") onBrowse();
          }}
        >
          <div className="upload-symbol">
            <CloudUpload size={24} />
          </div>
          <strong>Drop your image here</strong>
          <span>
            or <span className="inline-link">browse files</span> from your
            device
          </span>
          <div className="upload-meta">
            <span>JPG</span>
            <span>PNG</span>
            <span>WEBP</span>
            <span>GIF</span>
            <i /> Up to 12 MB
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept={accept}
        onChange={onFileInput}
      />
      <div className="privacy-note">
        <ShieldCheck size={15} />
        <span>
          Your image is securely processed and isn’t used to train AI models.
        </span>
      </div>
    </>
  );
}
