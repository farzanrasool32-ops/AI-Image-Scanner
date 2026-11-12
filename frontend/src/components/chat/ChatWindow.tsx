import { ArrowRight, Check, Plus, Sparkles } from "lucide-react";
import type { ChangeEvent, FormEvent, RefObject } from "react";
import type { ChatMessage as ChatMessageData } from "../../types/scan.types";
import Button from "../common/Button";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

const suggestions = [
  "What stands out in this image?",
  "Read any text you can see",
  "Describe the colors and lighting",
];

export default function ChatWindow({
  file,
  previewUrl,
  messages,
  question,
  onQuestionChange,
  onSend,
  isReplying,
  onAttach,
  inputRef,
  onFileInput,
  bottomRef,
  error,
}: {
  file: File | null;
  previewUrl: string;
  messages: ChatMessageData[];
  question: string;
  onQuestionChange: (value: string) => void;
  onSend: (event: FormEvent<HTMLFormElement>) => void;
  isReplying: boolean;
  onAttach: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  onFileInput: (event: ChangeEvent<HTMLInputElement>) => void;
  bottomRef: RefObject<HTMLDivElement | null>;
  error: string;
}) {
  return (
    <div className="panel chat-panel">
      <div className="chat-header">
        <span className="assistant-avatar">
          <Sparkles size={17} />
        </span>
        <div>
          <strong>Visio assistant</strong>
          <span>
            <i className="status-dot" /> Ready to explore
          </span>
        </div>
        <Button variant="outline" size="small" onClick={onAttach}>
          <Plus size={14} /> New chat
        </Button>
      </div>
      {file && (
        <div className="chat-image-context">
          <img src={previewUrl} alt={`Chat attachment: ${file.name}`} />
          <div>
            <strong>{file.name}</strong>
            <span>Image attached to this conversation</span>
          </div>
          <span className="context-check">
            <Check size={14} />
          </span>
        </div>
      )}
      <div className="chat-messages">
        {!messages.length && (
          <div className="chat-welcome">
            <div className="welcome-spark">
              <Sparkles size={20} />
            </div>
            <h2>
              {file
                ? "Let’s take a closer look."
                : "What would you like to explore?"}
            </h2>
            <p>
              {file
                ? "Ask me anything about the image you’ve shared."
                : "Choose an image, then ask a question about what you see."}
            </p>
            {!file && (
              <Button onClick={onAttach}>
                <Plus size={16} /> Attach an image
              </Button>
            )}
            {file && (
              <div className="suggestion-list">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onQuestionChange(suggestion)}
                  >
                    {suggestion}
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessage key={`${message.role}-${index}`} message={message} />
        ))}
        {isReplying && (
          <div className="chat-message assistant">
            <span className="message-avatar">
              <Sparkles size={14} />
            </span>
            <div className="message-content">
              <span className="message-author">Visio assistant</span>
              <p className="typing-indicator">
                <i />
                <i />
                <i />
              </p>
            </div>
          </div>
        )}
        {error && (
          <div className="error-message chat-error" role="alert">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <ChatInput
        fileAttached={!!file}
        question={question}
        onQuestionChange={onQuestionChange}
        onSend={onSend}
        onAttach={onAttach}
        inputRef={inputRef}
        onFileInput={onFileInput}
        disabled={isReplying}
      />
      <p className="chat-disclaimer">
        AI can make mistakes. Check important information.
      </p>
    </div>
  );
}
