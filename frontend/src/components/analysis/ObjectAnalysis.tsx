import { ScanLine } from "lucide-react";

export default function ObjectAnalysis({ objects }: { objects: string[] }) {
  return (
    <article className="result-card">
      <div className="result-card-heading">
        <span>
          <ScanLine size={17} />
        </span>
        <h3>Objects detected</h3>
      </div>
      <div className="tag-list">
        {objects.length ? (
          objects.map((object, index) => (
            <span className="result-tag" key={`${object}-${index}`}>
              {object}
            </span>
          ))
        ) : (
          <span className="muted-copy">No distinct objects were returned.</span>
        )}
      </div>
    </article>
  );
}
