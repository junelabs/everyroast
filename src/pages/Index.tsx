
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
        <h2 className="text-3xl font-bold text-roast-800 mb-6">Top Coffees This Week</h2>
        <CoffeeExplorerSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
