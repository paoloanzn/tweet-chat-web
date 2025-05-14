import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { getApiBaseUrl } from "../../config";
import { APICallError } from "ai";

const API_BASE_URL = getApiBaseUrl();

export function NewPersonaDialog({ open, onOpenChange, onPersonaCreated }) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { getAuthHeader } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Remove @ if user included it
      const cleanUsername = username.replace("@", "");

      const response = await fetch(`${API_BASE_URL}/persona/add-new`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: cleanUsername,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create persona");
      }

      await onPersonaCreated();
      onOpenChange(false);
      setUsername("");
    } catch (error) {
      setError(error.message || "Failed to create persona");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open) => {
    if (!open) {
      setError("");
      setUsername("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Persona</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Twitter Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
                disabled={isLoading}
              />
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isLoading || !username.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Persona
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
