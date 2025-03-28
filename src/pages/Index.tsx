
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RoasterPreviewSection from "@/components/RoasterPreviewSection";
import CoffeeExplorerSection from "@/components/CoffeeExplorerSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/auth";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
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

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <Header />
      <main className="flex-grow flex flex-col">
        <HeroSection />
        <RoasterPreviewSection />
        <div className="container mx-auto px-4 py-12 bg-white">
          <CoffeeExplorerSection />
        </div>
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
