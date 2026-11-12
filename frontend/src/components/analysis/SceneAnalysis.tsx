import { Image as ImageIcon } from 'lucide-react'

export default function SceneAnalysis({ scene, background }: { scene: string; background: string }) {
  return (
    <article className="result-card">
      <div className="result-card-heading"><span><ImageIcon size={17} /></span><h3>Scene &amp; environment</h3></div>
      <p className="result-paragraph">{scene || 'No scene description available.'}</p>
      {background && <p className="result-secondary">{background}</p>}
    </article>
  )
}