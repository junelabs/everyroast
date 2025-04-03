
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(visibleCount || 8)].map((_, index) => (
          <div key={index} className="aspect-[4/3]">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (coffees.length === 0) {
    // Return null here instead of an empty state message
    // Let the parent handle the empty state
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {coffees.slice(0, visibleCount).map((coffee) => (
        <div key={coffee.id} className="w-full">
          <CoffeeCard coffee={coffee} />
        </div>
      ))}
    </div>
  );
});

CoffeeGrid.displayName = 'CoffeeGrid';

export default CoffeeGrid;
