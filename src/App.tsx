import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { useAuth } from "./context/auth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CoffeeDetails from "./pages/CoffeeDetails";
import Roasters from "./pages/Roasters";
import RoasterDetails from "./pages/RoasterDetails";
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
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<IndexRouteWrapper />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/coffee/:id" element={<CoffeeDetails />} />
            <Route path="/roasters" element={<Roasters />} />
            <Route path="/roasters/:id" element={<RoasterDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
