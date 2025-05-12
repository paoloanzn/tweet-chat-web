import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Menu } from "lucide-react";
import { PersonaSelector } from "./PersonaSelector";
import { ConversationList } from "./ConversationList";
import { ChatContainer } from "./ChatContainer";
import { cn } from "@/lib/utils";

export function ChatLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPersona, setCurrentPersona] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePersonaChange = (persona) => {
    setCurrentPersona(persona);
    setSelectedConversation(null);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewConversation = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  return (
    <div className="flex h-screen">
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:relative z-40 h-full bg-background transition-all duration-300 ease-in-out",
          isMobile
            ? isSidebarOpen
              ? "w-[280px] translate-x-0"
              : "w-[280px] -translate-x-full"
            : isCollapsed
              ? "w-[60px]"
              : "w-[340px]",
        )}
      >
        <div className="flex flex-col h-full border-r">
          {/* Avatar and button container */}
          <div className={cn("border-b", isCollapsed ? "p-2" : "p-4")}>
            {isCollapsed ? (
              // Collapsed state
              <div className="flex flex-col items-center gap-2">
                <PersonaSelector
                  collapsed={true}
                  onPersonaChange={handlePersonaChange}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => setIsCollapsed(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // Expanded state
              <div className="flex items-center space-x-2">
                <div className="flex-1 pt-2">
                  <PersonaSelector
                    collapsed={false}
                    onPersonaChange={handlePersonaChange}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => setIsCollapsed(true)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {(!isCollapsed || isSidebarOpen) && (
            <div className="flex-1 overflow-hidden">
              <ConversationList
                collapsed={!isMobile && isCollapsed}
                personaId={currentPersona?.id}
                selectedId={selectedConversation}
                onSelect={(id) => {
                  setSelectedConversation(id);
                  if (isMobile) setIsSidebarOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={cn(
          "flex-1 overflow-hidden transition-all duration-300",
          isMobile && isSidebarOpen && "opacity-50",
        )}
      >
        <ChatContainer
          conversationId={selectedConversation}
          personaName={currentPersona?.name}
          personaId={currentPersona?.id}
          onConversationCreated={handleNewConversation}
        />
      </main>
    </div>
  );
}
