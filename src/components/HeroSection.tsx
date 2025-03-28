
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to signup page with email pre-populated
    navigate(`/signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="relative w-full pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80')",
          filter: "brightness(0.65)"
        }}
      />
      
      {/* Wavy border at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 w-full overflow-hidden">
        <svg 
          className="relative block w-full h-[50px]" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,120V73.71c47.79-22.2,103.59-32.17,158-28,70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27-18,138.3-24.88,209.4-13.08,36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,134.29,1200,67.53V120Z" 
            fill="#ffffff" 
            opacity="1"
          ></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 z-10 relative flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-7/12 text-white text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Your Perfect <span className="text-roast-300">Cup of Coffee</span>
          </h1>
          
          <p className="text-xl mb-8 text-coffee-100/90 max-w-2xl mx-auto lg:mx-0">
            Join thousands of coffee enthusiasts sharing their experiences and discoveries. Log, rate, and connect over the perfect brew.
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-12">
            <span className="bg-roast-500/20 backdrop-blur-sm border border-roast-500/30 text-white px-4 py-2 rounded-full text-sm font-medium">
              5,000+ Coffee Reviews
            </span>
            <span className="bg-roast-500/20 backdrop-blur-sm border border-roast-500/30 text-white px-4 py-2 rounded-full text-sm font-medium">
              1,200+ Roasters
            </span>
            <span className="bg-roast-500/20 backdrop-blur-sm border border-roast-500/30 text-white px-4 py-2 rounded-full text-sm font-medium">
              37,000+ Users
            </span>
          </div>
        </div>
        
        <div className="lg:w-5/12 w-full max-w-md">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">#1 Coffee Community</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Every Roast</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full py-5 px-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-roast-500 hover:bg-roast-600 text-white py-6 font-medium rounded-lg flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-sm text-gray-500">
                Free to join. No credit card required.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
