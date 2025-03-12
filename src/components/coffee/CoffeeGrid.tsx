
import React from 'react';
import CoffeeCard from '@/components/CoffeeCard';
import { Coffee } from '@/types/coffee';
import { Skeleton } from '@/components/ui/skeleton';

interface CoffeeGridProps {
  coffees: Coffee[];
  isLoading: boolean;
  visibleCount: number;
}

const CoffeeGrid: React.FC<CoffeeGridProps> = React.memo(({ coffees, isLoading, visibleCount }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(visibleCount || 6)].map((_, index) => (
          <div key={index} className="aspect-square">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
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
        <div key={coffee.id} className="w-full aspect-square">
          <CoffeeCard coffee={coffee} />
        </div>
      ))}
    </div>
  );
});

CoffeeGrid.displayName = 'CoffeeGrid';

export default CoffeeGrid;
