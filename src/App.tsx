
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { useAuth } from "./context/auth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProfilePage from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CoffeeDetails from "./pages/CoffeeDetails";
import Roasters from "./pages/Roasters";
import RoasterDetails from "./pages/RoasterDetails";
import Cafes from "./pages/Cafes";
import Recipes from "./pages/Recipes";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const IndexRouteWrapper = () => {
  const { user, isLoading, authInitialized } = useAuth();
  
  if (isLoading || !authInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roast-500 mb-4"></div>
        <div className="text-roast-500">Loading...</div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/profile" replace />;
  }
  
  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <Routes>
          {/* Standard routes */}
          <Route path="/" element={<IndexRouteWrapper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/coffee/:id" element={<CoffeeDetails />} />
          <Route path="/roasters" element={<Roasters />} />
          <Route path="/roasters/:id" element={<RoasterDetails />} />
          <Route path="/cafes" element={<Cafes />} />
          <Route path="/recipes" element={<Recipes />} />
          
          {/* ID-based profile route (for backward compatibility) */}
          <Route path="/profile/:userId" element={<ProfilePage />} />
          
          {/* IMPORTANT: Username route must be LAST to avoid conflicts */}
          <Route path="/:username" element={<ProfilePage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
