import { ArrowRight, ShieldCheck, WandSparkles } from 'lucide-react'
import type { ChangeEvent, FormEvent, RefObject } from 'react'
import type { ChatMessage } from '../types/scan.types'
import ChatWindow from '../components/chat/ChatWindow'

export default function ImageChat({ file, previewUrl, messages, question, onQuestionChange, onSend, isReplying, onAttach, fileInput, onFileInput, bottomRef, error, onNewChat }: {
  file: File | null; previewUrl: string; messages: ChatMessage[]; question: string
  onQuestionChange: (value: string) => void; onSend: (event: FormEvent<HTMLFormElement>) => void
  isReplying: boolean; onAttach: () => void; fileInput: RefObject<HTMLInputElement | null>
  onFileInput: (event: ChangeEvent<HTMLInputElement>) => void; bottomRef: RefObject<HTMLDivElement | null>; error: string; onNewChat: () => void
}) {
  return (
    <div className="subpage assistant-page">
      <div className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR VISUAL COPILOT</div><h1>Image assistant</h1><p>Ask questions and explore an image, one conversation at a time.</p></div></div>
      <section className="assistant-layout">
        <ChatWindow file={file} previewUrl={previewUrl} messages={messages} question={question} onQuestionChange={onQuestionChange} onSend={onSend} isReplying={isReplying} onAttach={file ? onNewChat : onAttach} inputRef={fileInput} onFileInput={onFileInput} bottomRef={bottomRef} error={error} />
        <aside className="assistant-side">
          <div className="assistant-tip"><div className="tip-icon"><WandSparkles size={17} /></div><h3>Make the most of it</h3><p>Your assistant can reason about visible details, compare elements, and extract text from your image.</p><div className="tip-divider" /><span><ShieldCheck size={14} /> Your image is only sent when you ask</span></div>
          <div className="assistant-prompts"><span className="eyebrow">TRY ASKING</span>{['What stands out in this image?', 'Read any text you can see', 'Describe the colors and lighting'].map((suggestion, index) => <button key={suggestion} onClick={() => onQuestionChange(suggestion)}><span>{['01', '02', '03'][index]}</span>{suggestion}<ArrowRight size={14} /></button>)}</div>
        </aside>
      </section>
    </div>
  )
}