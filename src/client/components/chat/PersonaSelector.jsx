import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Trash, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NewPersonaDialog } from "./NewPersonaDialog";
import useChatStore from "@/store/chat";

export function PersonaSelector({ collapsed }) {
  const { getAuthHeader } = useAuth();
  const {
    personas,
    currentPersona,
    fetchPersonas,
    setCurrentPersona,
    setCurrentConversation,
  } = useChatStore();
  const [isNewPersonaOpen, setIsNewPersonaOpen] = useState(false);

  useEffect(() => {
    fetchPersonas(getAuthHeader);
  }, []);

  const handlePersonaSelect = (persona) => {
    setCurrentPersona(persona);
    setCurrentConversation(null);
  };

  const deletePersona = async (id) => {
    try {
      await fetch("http://localhost:3000/persona/delete", {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ personaId: id }),
      });
      await fetchPersonas(getAuthHeader);
      if (currentPersona?.id === id) {
        const remainingPersona = personas.find((p) => p.id !== id);
        setCurrentPersona(remainingPersona || null);
      }
    } catch (error) {
      console.error("Failed to delete persona:", error);
    }
  };

  // If no personas exist, show only the "Add New Persona" button
  if (personas.length === 0) {
    return (
      <>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsNewPersonaOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add First Persona
        </Button>

        <NewPersonaDialog
          open={isNewPersonaOpen}
          onOpenChange={setIsNewPersonaOpen}
          onPersonaCreated={fetchPersonas}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full p-0 cursor-pointer ${!collapsed ? "border rounded-(--radius)" : ""}`}
          >
            <div
              className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} gap-2`}
            >
              {currentPersona ? (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={currentPersona.data?.profile?.avatar}
                      alt={currentPersona.name}
                    />
                    <AvatarFallback>
                      <UserCircle className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <span className="truncate">{currentPersona.name}</span>
                  )}
                </>
              ) : (
                <>
                  <UserCircle className="h-9 w-9" />
                  {!collapsed && <span>Select Persona</span>}
                </>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[230px]">
          {personas.map((persona) => (
            <DropdownMenuItem
              key={persona.id}
              className="flex justify-between items-center cursor-pointer my-1 rounded-(--radius)"
              onSelect={() => handlePersonaSelect(persona)}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={persona.data?.profile?.avatar}
                    alt={persona.name}
                  />
                  <AvatarFallback>
                    <UserCircle className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{persona.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-6 w-6 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePersona(persona.id);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            className="cursor-pointer rounded-(--radius)"
            onSelect={() => setIsNewPersonaOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Persona
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NewPersonaDialog
        open={isNewPersonaOpen}
        onOpenChange={setIsNewPersonaOpen}
        onPersonaCreated={fetchPersonas}
      />
    </>
  );
}
