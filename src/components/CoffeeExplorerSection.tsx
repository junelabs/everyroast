
import { useState, useEffect } from 'react';
import FilterTabs from '@/components/FilterTabs';
import { useAuth } from '@/context/auth';
import { useCoffeeExplorer } from '@/hooks/useCoffeeExplorer';
import CoffeeGrid from '@/components/coffee/CoffeeGrid';
import LoadMoreButton from '@/components/coffee/LoadMoreButton';

const CoffeeExplorerSection = () => {
  const [visibleCoffees, setVisibleCoffees] = useState(4);
  const { user } = useAuth();
  const { coffeeData, isLoading, fetchCommunityCoffees } = useCoffeeExplorer();
  
  // Re-fetch coffees when the component mounts
  useEffect(() => {
    fetchCommunityCoffees();
  }, [fetchCommunityCoffees]);
  
  const handleLoadMore = () => {
    setVisibleCoffees(prev => prev + 4);
  };
  
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
