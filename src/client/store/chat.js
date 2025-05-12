import { create } from "zustand";

const useChatStore = create((set, get) => ({
  // Personas state
  personas: [],
  currentPersona: null,
  setPersonas: (personas) => set({ personas }),
  setCurrentPersona: (persona) => set({ currentPersona: persona }),

  // Conversations state
  conversations: [],
  currentConversation: null,
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) =>
    set({ currentConversation: conversation }),

  // Messages state
  messages: [],
  isStreaming: false,
  streamingContent: "",
  setMessages: (messages) => set({ messages }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setStreamingContent: (content) => set({ streamingContent: content }),

  // API Actions
  fetchPersonas: async (getAuthHeader) => {
    try {
      const response = await fetch("http://localhost:3000/persona/list", {
        headers: getAuthHeader(),
      });
      const { data } = await response.json();
      set({ personas: data || [] });
      if (data?.length > 0 && !get().currentPersona) {
        set({ currentPersona: data[0] });
      }
      return data;
    } catch (error) {
      console.error("Failed to fetch personas:", error);
      set({ personas: [] });
    }
  },

  fetchConversations: async (personaId, getAuthHeader) => {
    if (!personaId) return;
    try {
      const response = await fetch(
        `http://localhost:3000/conversation/list/${personaId}`,
        { headers: getAuthHeader() },
      );
      const { data } = await response.json();
      set({ conversations: data || [] });
      return data;
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      set({ conversations: [] });
    }
  },

  createNewConversation: async (personaId, getAuthHeader) => {
    try {
      const response = await fetch(
        "http://localhost:3000/conversation/add-new",
        {
          method: "POST",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personaId,
            conversationData: { messages: [] },
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const { data } = await response.json();

      // Ensure we have valid data
      if (!data || data.length === 0 || !data[0].id) {
        throw new Error("Invalid response data");
      }

      // Update conversations list
      await get().fetchConversations(personaId, getAuthHeader);

      // Set the new conversation as current
      set({ currentConversation: data[0] });

      return data[0];
    } catch (error) {
      console.error("Failed to create conversation:", error);
      throw error;
    }
  },

  sendMessage: async (content, getAuthHeader) => {
    const state = get();
    if (!content.trim() || state.isStreaming) return;

    try {
      // Step 1: Create new conversation if none exists and set it as active
      let conversationId = state.currentConversation?.id;
      if (!conversationId) {
        const newConv = await state.createNewConversation(
          state.currentPersona.id,
          getAuthHeader,
        );
        // Wait for the conversation to be created and set
        conversationId = newConv.id;
        // Ensure we have the ID before proceeding
        if (!conversationId) {
          throw new Error("Failed to create new conversation");
        }
      }

      // Step 2: Add user message to UI
      const userMessage = {
        role: "user",
        message: content,
        timestamp: Math.floor(Date.now() / 1000),
      };

      // Keep track of messages locally instead of relying on state updates
      let currentMessages = [...state.messages, userMessage];

      set((state) => ({
        messages: currentMessages,
        isStreaming: true,
        streamingContent: "",
      }));

      // Step 3: Send message using the confirmed conversation ID
      const response = await fetch(
        `http://localhost:3000/chat/new-message/${conversationId}`,
        {
          method: "POST",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        },
      );

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const events = chunk.split("\n\n").filter(Boolean);

        for (const event of events) {
          if (event.startsWith("data: ")) {
            const data = JSON.parse(event.slice(6));
            if (data.text) {
              accumulatedResponse += data.text;
              set({ streamingContent: accumulatedResponse });
            }
          }
        }
      }

      const assistantMessage = {
        role: "persona",
        message: accumulatedResponse,
        timestamp: Math.floor(Date.now() / 1000),
      };

      // Update with both the user message and assistant message
      currentMessages = [...currentMessages, assistantMessage];

      set((state) => ({
        messages: currentMessages,
        isStreaming: false,
        streamingContent: "",
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
      set({ isStreaming: false, streamingContent: "" });
    }
  },

  loadConversation: async (id, getAuthHeader) => {
    try {
      const response = await fetch(`http://localhost:3000/conversation/${id}`, {
        headers: getAuthHeader(),
      });
      const { data } = await response.json();
      if (data?.conversation?.messages) {
        set({ messages: data.conversation.messages });
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  },

  deleteConversation: async (id, getAuthHeader) => {
    const state = get();
    try {
      await fetch(`http://localhost:3000/conversation/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      // Refresh conversations list
      await state.fetchConversations(state.currentPersona.id, getAuthHeader);

      // If the deleted conversation was the current one, clear it
      if (state.currentConversation?.id === id) {
        set({
          currentConversation: null,
          messages: [],
        });
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      throw error;
    }
  },
}));

export default useChatStore;
