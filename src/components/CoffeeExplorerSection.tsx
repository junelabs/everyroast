
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterTabs from '@/components/FilterTabs';
import { useAuth } from '@/context/auth';
import { useCoffeeExplorer } from '@/hooks/useCoffeeExplorer';
import CoffeeGrid from '@/components/coffee/CoffeeGrid';
import LoadMoreButton from '@/components/coffee/LoadMoreButton';
import { Button } from '@/components/ui/button';
import { UserPlus, Coffee, Users } from 'lucide-react';

const CoffeeExplorerSection = () => {
  const [visibleCoffees, setVisibleCoffees] = useState(4);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { coffeeData, isLoading, fetchCommunityCoffees, setupRealtimeSubscription } = useCoffeeExplorer();
  
  // Fetch fresh data when component mounts and user is logged in
  useEffect(() => {
    if (user) {
      console.log("CoffeeExplorerSection mounted, fetching coffees...");
      fetchCommunityCoffees();
      
      // Set up an interval to re-fetch coffees every 30 seconds to ensure we don't miss any changes
      const intervalId = setInterval(() => {
        console.log("Scheduled refresh of community coffees");
        fetchCommunityCoffees();
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [fetchCommunityCoffees, user]);
  
  // Set up realtime subscription separately to avoid re-subscribing on every render
  useEffect(() => {
    if (user) {
      console.log("Setting up realtime subscriptions");
      const cleanup = setupRealtimeSubscription();
      return cleanup;
    }
  }, [setupRealtimeSubscription, user]);
  
  // Log when coffee data changes
  useEffect(() => {
    if (user && coffeeData.length > 0) {
      console.log("Coffee data updated, count:", coffeeData.length);
    }
  }, [coffeeData, user]);
  
  const handleLoadMore = () => {
    setVisibleCoffees(prev => prev + 4);
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };
  
  // Show sign-up prompt for non-logged in users
  if (!user) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-roast-800 mb-6 pl-0">Community Coffee Reviews</h2>
          
          <div className="bg-gray-50 rounded-xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="w-24 h-24 bg-roast-100 rounded-full flex items-center justify-center mb-6">
                <Coffee className="h-12 w-12 text-roast-600" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Join our coffee community</h3>
              
              <p className="text-gray-600 mb-8 text-lg">
                Sign up to see coffee reviews from enthusiasts around the world, 
                track your favorite brews, and share your own coffee experiences.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-10">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
                  <UserPlus className="h-10 w-10 text-roast-500 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Create a Profile</h4>
                  <p className="text-gray-600 text-center text-sm">Track your coffee journey and preferences over time</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
                  <Coffee className="h-10 w-10 text-roast-500 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Rate Coffees</h4>
                  <p className="text-gray-600 text-center text-sm">Share your honest opinions on coffees you've tried</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
                  <Users className="h-10 w-10 text-roast-500 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Connect</h4>
                  <p className="text-gray-600 text-center text-sm">Discover and follow other coffee enthusiasts</p>
                </div>
              </div>
              
              <Button 
                onClick={handleSignUpClick}
                className="bg-roast-500 hover:bg-roast-600 text-white font-medium py-6 px-8 rounded-lg text-lg"
              >
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Show regular content for logged in users
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-roast-800 mb-6 pl-0">Community Coffee Reviews</h2>
        
        <FilterTabs />
        
        <CoffeeGrid 
          coffees={coffeeData} 
          isLoading={isLoading} 
          visibleCount={visibleCoffees} 
        />
        
        <LoadMoreButton 
          isVisible={coffeeData.length > visibleCoffees}
          isAuthenticated={!!user}
          onLoadMore={handleLoadMore}
        />
      </div>
    </section>
  );
};

export default CoffeeExplorerSection;
