
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Coffee, Star, Users, Map } from "lucide-react";
import { useAuth } from "@/context/auth";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-roast-900 leading-tight mb-6">
              Discover & Share Your Coffee Journey
            </h1>
            <p className="text-lg md:text-xl text-roast-700 mb-8 max-w-lg">
              Join the community of coffee enthusiasts exploring the world's finest roasts. Track your experiences, discover new flavors, and connect with fellow coffee lovers.
            </p>
            <div className="flex flex-wrap gap-4">
              {!user ? (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="bg-roast-600 hover:bg-roast-700 text-white font-medium rounded-full">
                      Join Every Roast →
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="rounded-full">
                      Sign In
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/profile">
                  <Button size="lg" className="bg-roast-600 hover:bg-roast-700 text-white font-medium rounded-full">
                    Go to Your Profile →
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1498804103079-a6351b050096?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                alt="Coffee pour over" 
                className="rounded-lg shadow-xl w-full md:max-w-md"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">4.9/5 average rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-roast-900 mb-12">
            Everything You Need for Your Coffee Passion
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-amber-50 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="bg-roast-100 p-4 rounded-full mb-4">
                <Coffee className="h-8 w-8 text-roast-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-roast-800">Track Your Brews</h3>
              <p className="text-roast-600">
                Log and rate every coffee you try. Keep a personal journal of your favorites and discoveries.
              </p>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="bg-roast-100 p-4 rounded-full mb-4">
                <Map className="h-8 w-8 text-roast-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-roast-800">Explore Coffee Shops</h3>
              <p className="text-roast-600">
                Find the best local cafés and roasters. See what others are enjoying nearby.
              </p>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="bg-roast-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-roast-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-roast-800">Join the Community</h3>
              <p className="text-roast-600">
                Connect with other coffee enthusiasts. Share recommendations and brewing techniques.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-roast-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-roast-900 mb-12">
            Loved by Coffee Enthusiasts
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Every Roast has completely changed how I explore new coffees. I've discovered so many amazing roasters I would have never found otherwise."
              </p>
              <div className="flex items-center">
                <div className="bg-roast-200 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-roast-700 font-medium">JD</span>
                </div>
                <div>
                  <p className="font-medium">James Davis</p>
                  <p className="text-sm text-gray-500">Home barista</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "I love being able to keep track of all the coffees I try. The community recommendations have introduced me to so many new flavor profiles."
              </p>
              <div className="flex items-center">
                <div className="bg-roast-200 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-roast-700 font-medium">SM</span>
                </div>
                <div>
                  <p className="font-medium">Sarah Mitchell</p>
                  <p className="text-sm text-gray-500">Coffee shop owner</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "As someone who travels often, I rely on Every Roast to find the best cafés in new cities. It hasn't let me down yet!"
              </p>
              <div className="flex items-center">
                <div className="bg-roast-200 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-roast-700 font-medium">AK</span>
                </div>
                <div>
                  <p className="font-medium">Alex Kim</p>
                  <p className="text-sm text-gray-500">Coffee enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-roast-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Coffee Journey Today
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of coffee lovers who have already discovered their next favorite brew with Every Roast.
          </p>
          {!user ? (
            <Link to="/signup">
              <Button size="lg" className="bg-white text-roast-800 hover:bg-gray-100 font-medium rounded-full">
                Create Your Free Account
              </Button>
            </Link>
          ) : (
            <Link to="/profile">
              <Button size="lg" className="bg-white text-roast-800 hover:bg-gray-100 font-medium rounded-full">
                Go to Your Profile
              </Button>
            </Link>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
