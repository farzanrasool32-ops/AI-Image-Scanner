import { Sparkles } from "lucide-react";
import type { ChatMessage as ChatMessageData } from "../../types/scan.types";

export default function ChatMessage({ message }: { message: ChatMessageData }) {
  const isAssistant = message.role === "assistant";
  return (
    <div className={`chat-message ${message.role}`}>
      <span className="message-avatar">
        {isAssistant ? <Sparkles size={14} /> : "V"}
      </span>
      <div className="message-content">
        <span className="message-author">
          {isAssistant ? "Visio assistant" : "You"}
        </span>
        <p>{message.text}</p>
      </div>
    </div>
  );
}
