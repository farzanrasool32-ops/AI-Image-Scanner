import { ArrowRight, Plus } from "lucide-react";
import type { ChangeEvent, FormEvent, RefObject } from "react";

const accept = "image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff";

export default function ChatInput({
  fileAttached,
  question,
  onQuestionChange,
  onSend,
  onAttach,
  inputRef,
  onFileInput,
  disabled,
}: {
  fileAttached: boolean;
  question: string;
  onQuestionChange: (value: string) => void;
  onSend: (event: FormEvent<HTMLFormElement>) => void;
  onAttach: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  onFileInput: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}) {
  return (
    <form className="chat-composer" onSubmit={onSend}>
      <button
        type="button"
        className={`attach-button${fileAttached ? " attached" : ""}`}
        onClick={onAttach}
        aria-label={fileAttached ? "Change attached image" : "Attach an image"}
      >
        <Plus size={19} />
      </button>
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept={accept}
        onChange={onFileInput}
      />
      <input
        value={question}
        onChange={(event) => onQuestionChange(event.target.value)}
        placeholder={
          fileAttached
            ? "Ask a question about this image…"
            : "Attach an image to get started…"
        }
        disabled={!fileAttached || disabled}
      />
      <span className="composer-shortcut">↵</span>
      <button
        className="send-button"
        type="submit"
        disabled={!fileAttached || !question.trim() || disabled}
        aria-label="Send message"
      >
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
