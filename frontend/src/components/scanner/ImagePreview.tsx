import { Check, FileImage, X } from "lucide-react";
import type { ImageFileInfo } from "../../types/image.types";

export default function ImagePreview({
  previewUrl,
  file,
  size,
  onRemove,
}: {
  previewUrl: string;
  file: ImageFileInfo;
  size: string;
  onRemove: () => void;
}) {
  return (
    <div className="selected-image">
      <img src={previewUrl} alt={`Preview of ${file.name}`} />
      <div className="selected-overlay">
        <span>
          <Check size={14} /> Image ready
        </span>
        <button onClick={onRemove} aria-label="Remove image">
          <X size={17} />
        </button>
      </div>
      <div className="selected-file">
        <FileImage size={15} />
        <strong>{file.name}</strong>
        <span>{size}</span>
      </div>
    </div>
  );
}
