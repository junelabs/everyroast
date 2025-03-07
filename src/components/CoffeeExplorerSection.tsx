
import { useState } from 'react';
import { LayoutGrid, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CoffeeCard from '@/components/CoffeeCard';
import SearchBar from '@/components/SearchBar';
import FilterTabs from '@/components/FilterTabs';
import { coffeeData } from '@/data/coffeeData';

const CoffeeExplorerSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <section className="py-20 bg-roast-50/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-roast-800 mb-4">Explore Premium Coffee Beans</h2>
          <p className="text-xl text-roast-600 max-w-2xl mx-auto">
            Discover and compare the finest coffee beans from around the world, with detailed tasting notes and roaster information.
          </p>
        </div>
        
        {/* Filters and search row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <div className="flex gap-4 ml-auto">
            <Button variant="outline" className="rounded-full border-roast-200 text-roast-800 hover:bg-roast-100">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Grid view
            </Button>
            
            <Button variant="outline" className="rounded-full border-roast-200 text-roast-800 hover:bg-roast-100">
              Sort by
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
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
          <Button 
            variant="outline" 
            className="rounded-full px-8 py-6 border-roast-300 text-roast-800 hover:bg-roast-100 text-lg font-medium"
          >
            Load More Coffees
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoffeeExplorerSection;
