
import { useState, useEffect } from 'react';
import FilterTabs from '@/components/FilterTabs';
import { useAuth } from '@/context/auth';
import { useCoffeeExplorer } from '@/hooks/useCoffeeExplorer';
import CoffeeGrid from '@/components/coffee/CoffeeGrid';
import LoadMoreButton from '@/components/coffee/LoadMoreButton';

const CoffeeExplorerSection = () => {
  const [visibleCoffees, setVisibleCoffees] = useState(4);
  const { user } = useAuth();
  const { coffeeData, isLoading, fetchUserCoffees, setupRealtimeSubscription } = useCoffeeExplorer();
  
  // Fetch fresh data when component mounts
  useEffect(() => {
    console.log("CoffeeExplorerSection mounted, fetching coffees...");
    fetchUserCoffees();
    
    // Set up an interval to re-fetch coffees every 30 seconds to ensure we don't miss any changes
    const intervalId = setInterval(() => {
      console.log("Scheduled refresh of user coffees");
      fetchUserCoffees();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchUserCoffees]);
  
  // Set up realtime subscription separately to avoid re-subscribing on every render
  useEffect(() => {
    console.log("Setting up realtime subscriptions");
    const cleanup = setupRealtimeSubscription();
    return cleanup;
  }, [setupRealtimeSubscription]);
  
  // Log when coffee data changes
  useEffect(() => {
    console.log("Coffee data updated, count:", coffeeData.length);
  }, [coffeeData]);
  
  const handleLoadMore = () => {
    setVisibleCoffees(prev => prev + 4);
  };
  
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-roast-800 mb-6 pl-0">Your Coffee Reviews</h2>
        
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
