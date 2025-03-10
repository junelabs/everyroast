
import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: number;
}

const RatingBadge: React.FC<RatingBadgeProps> = ({ rating }) => {
  return (
    <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
      <span className="font-medium">{rating}</span>
    </div>
  );
};

export default RatingBadge;
