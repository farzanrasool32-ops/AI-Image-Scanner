import { FileText } from "lucide-react";

export default function OCRResults({
  text,
  documentType,
}: {
  text: string;
  documentType: string;
}) {
  return (
    <article className="result-card">
      <div className="result-card-heading">
        <span>
          <FileText size={17} />
        </span>
        <h3>Text in image</h3>
      </div>
      {documentType && <span className="document-type">{documentType}</span>}
      <p
        className={`result-paragraph extracted-text${!text ? " muted-copy" : ""}`}
      >
        {text || "No readable text detected."}
      </p>
    </article>
  );
}
