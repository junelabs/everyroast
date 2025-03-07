
import { useState } from 'react';
import CoffeeCard from '@/components/CoffeeCard';
import FilterTabs from '@/components/FilterTabs';
import { coffeeData } from '@/data/coffeeData';

const CoffeeExplorerSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-roast-800 mb-6 pl-0">Top Coffees This Week</h2>
        
        {/* Horizontal tabs/filter */}
        <FilterTabs />
        
        {/* Coffee cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coffeeData.map((coffee) => (
            <CoffeeCard key={coffee.id} coffee={coffee} />
          ))}
        </div>
        
        {/* Load more button */}
        <div className="mt-12 text-center">
          <button 
            className="rounded-full px-8 py-4 border border-roast-300 text-roast-800 hover:bg-roast-100 text-lg font-medium"
          >
            Load More Coffees
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoffeeExplorerSection;
