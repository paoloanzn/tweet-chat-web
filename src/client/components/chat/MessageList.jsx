import { MessageItem } from "./MessageItem";
import useChatStore from "@/store/chat";

export function MessageList() {
  const { messages, isStreaming, streamingContent } = useChatStore();

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <MessageItem
          key={`${message.timestamp}-${index}`}
          role={message.role}
          content={message.message}
          timestamp={message.timestamp}
        />
      ))}
      {isStreaming && (
        <MessageItem
          role="persona"
          content={streamingContent}
          isStreaming={true}
        />
      )}
    </div>
  );
}
