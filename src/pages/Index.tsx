
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CoffeeExplorerSection from "@/components/CoffeeExplorerSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <CoffeeExplorerSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
