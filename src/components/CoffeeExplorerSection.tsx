
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CoffeeCard from '@/components/CoffeeCard';
import FilterTabs from '@/components/FilterTabs';
import { coffeeData } from '@/data/coffeeData';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CoffeeExplorerSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCoffees, setVisibleCoffees] = useState(4);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLoadMore = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view more coffees.",
        variant: "default"
      });
      navigate('/login');
      return;
    }
    
    // If authenticated, show more coffees
    setVisibleCoffees(prev => prev + 4);
  };
  
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-roast-800 mb-6 pl-0">Top Coffees This Week</h2>
        
        {/* Horizontal tabs/filter */}
        <FilterTabs />
        
        {/* Coffee cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coffeeData.slice(0, visibleCoffees).map((coffee) => (
            <CoffeeCard key={coffee.id} coffee={coffee} />
          ))}
        </div>
        
        {/* Load more button */}
        <div className="mt-12 text-center">
          <Button 
            className={`rounded-full px-8 py-4 border border-roast-300 ${!user ? 'bg-roast-500 text-white hover:bg-roast-600' : 'text-roast-800 hover:bg-roast-100'} text-lg font-medium`}
            onClick={handleLoadMore}
          >
            {user ? 'Load More Coffees' : 'Sign In to See More'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoffeeExplorerSection;
