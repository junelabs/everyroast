
import React from 'react';
import CoffeeCard from '@/components/CoffeeCard';
import { Coffee } from '@/types/coffee';
import { Skeleton } from '@/components/ui/skeleton';

interface CoffeeGridProps {
  coffees: Coffee[];
  isLoading: boolean;
  visibleCount: number;
}

const CoffeeGrid: React.FC<CoffeeGridProps> = ({ coffees, isLoading, visibleCount }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {coffees.slice(0, visibleCount).map((coffee) => (
        <CoffeeCard key={coffee.id} coffee={coffee} />
      ))}
    </div>
  );
};

export default CoffeeGrid;
