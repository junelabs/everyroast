
import React from 'react';
import { Star } from 'lucide-react';
import { getRoastLevelEmoji, getProcessMethodEmoji } from '@/utils/coffeeUtils';
import { RoastLevel, ProcessMethod } from '@/types/coffee';

interface ReviewCardImageProps {
  review: any;
  formatDate: (dateString: string) => string;
}

const ReviewCardImage: React.FC<ReviewCardImageProps> = React.memo(({ review, formatDate }) => {
  // Helper to check if image is valid
  const hasValidImage = (): boolean => {
    const imageUrl = review.coffees?.image_url;
    return Boolean(imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '');
  };
  
  // Don't render anything if no image
  if (!hasValidImage()) {
    return null;
  }

  return (
    <div className="w-full h-full relative">
      <img 
        src={review.coffees?.image_url} 
        alt={review.coffees?.name || "Coffee"} 
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
      
      {review.rating && (
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-base font-medium">{review.rating}</span>
        </div>
      )}
      
      {review.created_at && (
        <div className="absolute top-4 left-4 z-10 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
          {formatDate(review.created_at)}
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 z-10 text-white p-4">
        <div className="flex justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold truncate">{review.coffees?.name || ""}</h3>
          </div>
        </div>
        
        <div className="flex justify-between mb-3">
          {review.coffees?.roasters?.name && (
            <div className="flex items-center text-gray-100 text-sm">
              <span className="mr-1">☕️</span>
              <span className="truncate max-w-[100px]">{review.coffees.roasters.name}</span>
            </div>
          )}
          {review.coffees?.origin && (
            <div className="flex items-center text-gray-200 text-sm">
              <span className="mr-1">📍</span>
              <span className="truncate max-w-[100px]">{review.coffees.origin}</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20">
          {review.coffees?.roast_level && (
            <div className="flex items-center">
              <span className="text-lg mr-1">{getRoastLevelEmoji(review.coffees.roast_level as RoastLevel)}</span>
              <div className="text-xs">{review.coffees.roast_level}</div>
            </div>
          )}
          
          {review.coffees?.process_method && (
            <div className="flex items-center">
              <span className="text-lg mr-1">{getProcessMethodEmoji(review.coffees.process_method as ProcessMethod)}</span>
              <div className="text-xs">{review.coffees.process_method}</div>
            </div>
          )}
          
          {review.coffees?.price !== null && review.coffees?.price !== undefined && (
            <div className="flex items-center justify-end">
              <span className="text-lg mr-1">💰</span>
              <div className="text-xs">${Number(review.coffees.price).toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ReviewCardImage.displayName = 'ReviewCardImage';

export default ReviewCardImage;
