
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CoffeeExplorerSection from "@/components/CoffeeExplorerSection";
import Footer from "@/components/Footer";
import LoginPrompt from "@/components/LoginPrompt";
import { useAuth } from "@/context/auth";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);
  
  // Set page title
  useEffect(() => {
    document.title = "Every Roast | Discover Great Coffee";
  }, []);
  
  // Display a helpful message if the user came from deleting a coffee
  useEffect(() => {
    const deletedParam = new URLSearchParams(window.location.search).get('deleted');
    if (deletedParam === 'true') {
      toast({
        title: "Coffee deleted",
        description: "The coffee post has been removed successfully."
      });
      
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('deleted');
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [toast]);

  // Track scroll position and show login prompt
  const handleScroll = useCallback(() => {
    if (user || hasShownPrompt) return;
    
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const scrollThreshold = windowHeight * 0.1; // 10% of the window height
    
    if (scrollPosition > scrollThreshold && !showLoginPrompt) {
      setShowLoginPrompt(true);
    }
  }, [user, hasShownPrompt, showLoginPrompt]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
    setHasShownPrompt(true); // Only show once per session
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <CoffeeExplorerSection />
      </div>
      <Footer />
      
      {/* Login prompt dialog */}
      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={closeLoginPrompt}
      />
    </div>
  );
};

export default Index;
