
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Coffee, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, user, isLoading, authInitialized } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password, { 
      full_name: name,
      username: username
    });
  };

  // Effect to handle redirection after successful signup
  useEffect(() => {
    if (user && !isLoading && authInitialized) {
      navigate('/profile', { replace: true });
    }
  }, [user, isLoading, authInitialized, navigate]);

  // Immediate redirect if already logged in
  if (user && !isLoading && authInitialized) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col sm:flex-row">
        {/* Left Column - Image */}
        <div className="hidden sm:block sm:w-1/2 lg:w-2/3 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1501747315-124a0eaca060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80')"
            }}
          />
          <div className="absolute inset-0 bg-coffee-900/30" />
          <div className="absolute top-8 left-8">
            <div className="flex items-center gap-2">
              <Coffee className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">Every Roast</span>
            </div>
          </div>
        </div>
        
        {/* Right Column - Form */}
        <div className="w-full sm:w-1/2 lg:w-1/3 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Link to="/" className="inline-flex items-center text-roast-600 mb-8 hover:text-roast-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
            
            <div className="sm:hidden mb-6">
              <div className="flex items-center gap-2">
                <Coffee className="h-8 w-8 text-roast-500" />
                <span className="text-xl font-bold text-roast-700">Every Roast</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600 mb-8">Start your coffee journey today</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-roast-500 hover:bg-roast-600 text-white font-medium"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
              
              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
            
            <p className="mt-8 text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-roast-600 hover:text-roast-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
