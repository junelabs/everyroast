
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Coffee, Leaf, MapPin, Star, ThermometerSun } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoffeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = "Every Roast | Coffee Details";
  }, []);

  // In a real app, we would fetch the coffee details based on the ID
  // For now, we'll just use a placeholder
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <Button 
          variant="ghost" 
          className="mb-6 text-roast-600" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Coffees
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
              alt="Ethiopian Yirgacheffe" 
              className="w-full h-[500px] object-cover"
            />
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <span className="bg-roast-100 text-roast-800 px-3 py-1 rounded-full text-sm font-medium">Single Origin</span>
              <div className="ml-auto flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-bold">4.8</span>
                <span className="text-gray-500 ml-1">(124 reviews)</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-roast-900 mb-2">Ethiopian Yirgacheffe</h1>
            
            <div className="flex items-center text-roast-600 mb-6">
              <Coffee className="h-5 w-5 mr-1" />
              <span className="font-medium">Stumptown Coffee Roasters</span>
            </div>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex flex-col items-center">
                <div className="text-xl">☀️</div>
                <div className="text-sm font-medium">Light</div>
                <div className="text-xs text-gray-500">Roast</div>
              </div>
              
              <div className="flex flex-col items-center">
                <ThermometerSun className="h-5 w-5 text-roast-500" />
                <div className="text-sm font-medium">Washed</div>
                <div className="text-xs text-gray-500">Process</div>
              </div>
              
              <div className="flex flex-col items-center">
                <MapPin className="h-5 w-5 text-roast-500" />
                <div className="text-sm font-medium">Ethiopia</div>
                <div className="text-xs text-gray-500">Origin</div>
              </div>
              
              <div className="flex flex-col items-center">
                <Leaf className="h-5 w-5 text-roast-500" />
                <div className="text-sm font-medium">Organic</div>
                <div className="text-xs text-gray-500">Farming</div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold text-roast-800 mb-2">Tasting Notes</h2>
              <p className="text-roast-600">Bright and vibrant with floral aromatics, bergamot notes, and a clean, citrusy finish. Exhibits classic Yirgacheffe characteristics with exceptional clarity.</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold text-roast-800 mb-2">About This Coffee</h2>
              <p className="text-roast-600 mb-4">
                This Ethiopian Yirgacheffe is sourced from family-owned farms in the Gedeo Zone of southern Ethiopia. After harvest, coffee is carefully sorted and depulped. The beans are then fermented for 48 hours before being washed and dried on elevated tables for up to 2 weeks.
              </p>
              <p className="text-roast-600">
                Grown at elevations between 1,700 and 2,200 meters above sea level, this coffee develops the complex flavors and bright acidity that Yirgacheffe is famous for.
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-roast-800">$18.50</div>
                <div className="text-sm text-gray-500">per pound</div>
              </div>
              
              <Button className="bg-roast-500 hover:bg-roast-600 px-8 py-6 text-white">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CoffeeDetails;
