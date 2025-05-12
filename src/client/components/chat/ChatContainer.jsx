import { useEffect, useRef } from "react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useAuth } from "@/contexts/AuthContext";
import useChatStore from "@/store/chat";

export function ChatContainer() {
  const { getAuthHeader } = useAuth();
  const messagesEndRef = useRef(null);
  const {
    currentConversation,
    currentPersona,
    messages,
    isStreaming,
    streamingContent,
    loadConversation,
  } = useChatStore();

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
    });
  };

  useEffect(() => {
    if (currentConversation?.id) {
      loadConversation(currentConversation.id, getAuthHeader);
    }
  }, [currentConversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const isEmpty = !currentConversation || messages.length === 0;

  return (
    <div className="flex flex-col h-full relative bg-background">
      <div className="flex-1 overflow-y-auto">
        {!isEmpty ? (
          <div className="p-4">
            <MessageList />
            <div ref={messagesEndRef} />
          </div>
        ) : null}
      </div>

      <div
        className={`
          ${
            isEmpty
              ? "absolute inset-0 flex items-center justify-center p-4"
              : "flex-none px-4 py-3 border-t bg-background/80 backdrop-blur-sm"
          }
        `}
      >
        <ChatInput
          disabled={isStreaming || !currentPersona}
          isEmpty={isEmpty}
        />
      </div>
    </div>
  );
}
