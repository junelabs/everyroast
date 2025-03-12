
import React, { useEffect } from 'react';
import CoffeeCard from '@/components/CoffeeCard';
import { Coffee } from '@/types/coffee';
import { Skeleton } from '@/components/ui/skeleton';

interface CoffeeGridProps {
  coffees: Coffee[];
  isLoading: boolean;
  visibleCount: number;
}

const CoffeeGrid: React.FC<CoffeeGridProps> = ({ coffees, isLoading, visibleCount }) => {
  // Log when coffees change for debugging
  useEffect(() => {
    console.log("CoffeeGrid received coffees:", coffees.length);
    
    // Check if any coffees have empty properties that might cause issues
    coffees.forEach(coffee => {
      if (!coffee.id || !coffee.name) {
        console.warn("Coffee with missing critical data:", coffee);
      }
    });
  }, [coffees]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="aspect-square bg-gray-200 animate-pulse rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (coffees.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No community reviews yet. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {coffees.slice(0, visibleCount).map((coffee) => (
        <CoffeeCard key={coffee.id} coffee={coffee} />
      ))}
    </div>
  );
};

export default CoffeeGrid;
