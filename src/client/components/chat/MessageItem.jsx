import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function MessageItem({ role, content, timestamp, isStreaming }) {
  const isUser = role === "user";
  const formattedTime = timestamp
    ? new Date(timestamp * 1000).toLocaleTimeString()
    : "";

  return (
    <div
      className={cn(
        "flex gap-2 mb-4",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <Card
        className={cn(
          "max-w-[80%] p-3",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <div className="flex flex-col gap-1">
          <div className="whitespace-pre-wrap break-words">{content}</div>
          <div
            className={cn(
              "text-xs opacity-70",
              isUser ? "text-right" : "text-left",
            )}
          >
            {isStreaming ? (
              <Loader2 className="h-3 w-3 animate-spin inline" />
            ) : (
              formattedTime
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
