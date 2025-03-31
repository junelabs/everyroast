
import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RatingBadge: React.FC<RatingBadgeProps> = ({ 
  rating, 
  showText = true,
  size = 'md'
}) => {
  // Size mappings for different star sizes
  const sizeMap = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  const starSize = sizeMap[size];
  
  // For inline display (not in a badge)
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`${starSize} ${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingBadge;
