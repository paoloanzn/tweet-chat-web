import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useChatStore from "@/store/chat";
import { cn } from "@/lib/utils";

export function ChatInput({ disabled, isEmpty }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const { getAuthHeader } = useAuth();
  const sendMessage = useChatStore((state) => state.sendMessage);
  const isStreaming = useChatStore((state) => state.isStreaming);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      await sendMessage(message, getAuthHeader);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "inherit";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const formClasses = cn(
    "flex flex-col gap-4",
    isEmpty ? "w-full max-w-2xl" : "",
  );

  const inputWrapperClasses = cn(
    "flex items-center gap-2",
    "relative border rounded-xl bg-input",
    isEmpty ? "p-4" : "p-4 justify-self-center w-[50%]",
  );

  return (
    <div className={formClasses}>
      {isEmpty && (
        <div className="text-3xl text-center mb-2 text-primary-foreground font-sans">
          Start the conversation
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full">
        <div className={inputWrapperClasses}>
          <Textarea
            ref={textareaRef}
            value={message}
            id="chat-input"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled}
            className="min-h-[20px] max-h-[200px] shadow-none resize-none focus:outline-none focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 p-3 bg-input text-secondary-foreground placeholder:font-mono no-scroll-bar"
            rows={1}
          />
          <Button
            type="submit"
            disabled={disabled || !message.trim() || isStreaming}
            size="icon"
            className="rounded-full h-8 w-8 bg-input hover:bg-primary/90 cursor-pointer"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <ArrowUp className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
