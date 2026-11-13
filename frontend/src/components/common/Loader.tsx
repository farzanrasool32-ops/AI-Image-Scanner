import { LoaderCircle } from "lucide-react";

export default function Loader({ label = "Loading…" }: { label?: string }) {
  return (
    <span className="loader-label">
      <LoaderCircle className="spin" size={17} aria-hidden="true" />
      {label}
    </span>
  );
}
