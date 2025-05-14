import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

const API_BASE_URL = getApiBaseUrl();

const AuthContext = createContext(null);

// Helper to manage localStorage
const SESSION_KEY = "auth_session";

const saveSessionToStorage = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const getSessionFromStorage = () => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

const clearSessionFromStorage = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [session, setSession] = useState(getSessionFromStorage);
  const navigate = useNavigate();

  // Effect to check token expiration
  useEffect(() => {
    if (session) {
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        // Token has expired
        signOut();
      }
    }
  }, [session]);

  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const sessionData = await response.json();
      setSession(sessionData);
      saveSessionToStorage(sessionData);
      navigate("/app");
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // After successful registration, sign in automatically
      return await signIn(email, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = () => {
    setSession(null);
    clearSessionFromStorage();
    navigate("/auth");
  };

  // Helper function to get the authorization header
  const getAuthHeader = () => {
    if (session?.access_token) {
      return {
        Authorization: `Bearer ${session.access_token}`,
      };
    }
    return {};
  };

  const value = {
    user: session?.user || null,
    session,
    signIn,
    signUp,
    signOut,
    getAuthHeader,
    isAuthenticated: !!session?.access_token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
