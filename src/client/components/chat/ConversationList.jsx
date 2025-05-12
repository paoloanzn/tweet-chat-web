import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Trash, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import useChatStore from "@/store/chat";

export function ConversationList({ collapsed }) {
  const { getAuthHeader } = useAuth();
  const {
    conversations,
    currentPersona,
    currentConversation,
    fetchConversations,
    setCurrentConversation,
    createNewConversation,
    deleteConversation,
  } = useChatStore();

  const handleCreateNewConversation = async () => {
    if (!currentPersona?.id) return;
    try {
      await createNewConversation(currentPersona.id, getAuthHeader);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  useEffect(() => {
    if (currentPersona?.id) {
      fetchConversations(currentPersona.id, getAuthHeader);
    }
  }, [currentPersona?.id]);

  if (!currentPersona?.id) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground p-4 text-center">
        <MessageSquare className="h-10 w-10 mb-4 opacity-50" />
        <p>Select a persona to view conversations</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {!collapsed && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-sm font-semibold">Conversations</h2>
          <Button
            onClick={handleCreateNewConversation}
            variant="ghost"
            size="icon"
            disabled={!currentPersona?.id}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={cn(
              "group flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent",
              currentConversation?.id === conversation.id && "bg-accent",
            )}
            onClick={() => setCurrentConversation(conversation)}
          >
            <span className={cn("flex-1 truncate", collapsed && "hidden")}>
              {conversation.conversation?.messages?.length > 0
                ? conversation.conversation.messages[0].message.substring(
                    0,
                    30,
                  ) + "..."
                : "New Conversation"}
            </span>

            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conversation.id, getAuthHeader);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
