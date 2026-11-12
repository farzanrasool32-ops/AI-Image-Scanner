import { ShieldCheck } from 'lucide-react'
import type { ImageQuality } from '../../types/scan.types'

function Quality({ label, value }: { label: string; value: string }) {
  return <div className="quality-item"><span>{label}</span><strong>{value || '—'}</strong></div>
}

export default function QualityAnalysis({ quality }: { quality: ImageQuality }) {
  return (
    <article className="result-card">
      <div className="result-card-heading"><span><ShieldCheck size={17} /></span><h3>Image quality</h3></div>
      <div className="quality-grid">
        <Quality label="Resolution" value={quality.resolution} />
        <Quality label="Brightness" value={quality.brightness} />
        <Quality label="Contrast" value={quality.contrast} />
        <Quality label="Sharpness" value={quality.sharpness} />
      </div>
      {quality.notes && <p className="result-secondary">{quality.notes}</p>}
    </article>
  )
}