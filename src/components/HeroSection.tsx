import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome to Every Roast!",
      description: "We've sent a confirmation email to your inbox.",
    });
  };

  return (
    <div className="relative w-full min-h-screen flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80')",
          filter: "brightness(0.65)"
        }}
      />
      
      <div className="container mx-auto px-6 md:px-12 z-10 flex flex-col md:flex-row items-center gap-12 py-20">
        <div className="md:w-7/12 text-white">
          <div className="mb-8 inline-block">
            <div className="flex items-center gap-2 border border-coffee-300/30 bg-coffee-900/30 backdrop-blur-sm py-2 px-4 rounded-full text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              </div>
              <span className="font-semibold">#1 Coffee Community</span>
              <span className="text-coffee-100/70 text-xs">SINCE 2023</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover the best coffee has to offer
          </h1>
          
          <p className="text-xl mb-8 text-coffee-100/90 max-w-2xl">
            Join the #1 global community of 37,098 coffee enthusiasts logging and sharing their experiences. 
            Don't sip alone, connect with fellow coffee lovers and expand your palate!
          </p>
          
          <div className="flex mb-10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-coffee-800 overflow-hidden">
                  <img 
                    src={`https://i.pravatar.cc/100?img=${i+10}`} 
                    alt="Community member" 
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">☕</span>
              <span className="text-lg font-medium underline decoration-coffee-300/50">
                Record and rate over 1000+ coffee varieties
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">❤️</span>
              <span className="text-lg font-medium underline decoration-coffee-300/50">
                Connect with coffee enthusiasts worldwide
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <span className="text-lg font-medium underline decoration-coffee-300/50">
                Discover new roasters and brewing methods
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <span className="text-lg font-medium underline decoration-coffee-300/50">
                Track your flavor preferences over time
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <span className="text-lg font-medium underline decoration-coffee-300/50">
                Join Every Roast discussions and events
              </span>
            </div>
          </div>
        </div>
        
        <div className="md:w-5/12 w-full max-w-md">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
            <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=927&q=80" 
                alt="Coffee brewing" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
                  <div className="h-14 w-14 bg-roast-500 rounded-full flex items-center justify-center">
                    <div className="border-t-4 border-r-4 border-white w-5 h-5 transform rotate-45 translate-x-[-2px]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Type your email..."
                className="w-full py-6 px-4 text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-roast-500 hover:bg-roast-600 text-white py-6 text-lg font-medium rounded-lg"
              >
                Join Every Roast →
              </Button>
              <p className="text-center text-sm text-gray-500">
                If you already have an account, we'll log you in
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
