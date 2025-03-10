
import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CoffeeExplorerSection from "@/components/CoffeeExplorerSection";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user, isLoading } = useAuth();

  // You can add special effects or data loading for authenticated users here
  useEffect(() => {
    if (user && !isLoading) {
      console.log("User is authenticated:", user.email);
      // You could fetch personalized data here
    }
  }, [user, isLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {!user && <HeroSection />}
      <div className="container mx-auto px-4 py-12 flex-grow">
        <CoffeeExplorerSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
