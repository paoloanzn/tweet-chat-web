import { Routes, Route, Navigate, BrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthPage } from "./components/auth/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { ChatLayout } from "./components/chat/ChatLayout";

// Temporary blank chat app page
const ChatApp = () => (
  <ChatLayout>
    <div className="h-full flex items-center justify-center text-muted-foreground">
      Select or create a conversation to start chatting
    </div>
  </ChatLayout>
);

// Logout route component that automatically triggers logout
const LogoutRoute = () => {
  const { signOut } = useAuth();

  // Effect to trigger logout when this route is accessed
  useEffect(() => {
    signOut();
  }, [signOut]);

  return null; // This component doesn't render anything
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <ChatApp />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<LogoutRoute />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
