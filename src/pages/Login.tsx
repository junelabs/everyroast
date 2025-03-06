
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Coffee, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login Successful",
      description: "Welcome back to Coffee Chronicle!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col sm:flex-row">
        {/* Left Column - Image */}
        <div className="hidden sm:block sm:w-1/2 lg:w-2/3 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1498804103079-a6351b050096?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80')"
            }}
          />
          <div className="absolute inset-0 bg-coffee-900/30" />
          <div className="absolute top-8 left-8">
            <div className="flex items-center gap-2">
              <Coffee className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">CoffeeChronicle</span>
            </div>
          </div>
        </div>
        
        {/* Right Column - Form */}
        <div className="w-full sm:w-1/2 lg:w-1/3 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Link to="/" className="inline-flex items-center text-coffee-600 mb-8 hover:text-coffee-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
            
            <div className="sm:hidden mb-6">
              <div className="flex items-center gap-2">
                <Coffee className="h-8 w-8 text-coffee-500" />
                <span className="text-xl font-bold text-coffee-700">CoffeeChronicle</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600 mb-8">Please enter your details to sign in</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-sm text-coffee-600 hover:text-coffee-700">Forgot password?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-coffee-500 hover:bg-coffee-600 text-white font-medium"
              >
                Sign in
              </Button>
            </form>
            
            <p className="mt-8 text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-coffee-600 hover:text-coffee-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
