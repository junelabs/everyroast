
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { getRoastLevelEmoji, getProcessMethodEmoji } from '@/utils/coffeeUtils';
import CoffeeDetailModal from '@/components/CoffeeDetailModal';
import ReviewForm from '@/components/reviews/ReviewForm';
import { CoffeeOrigin, RoastLevel, ProcessMethod } from '@/types/coffee';

interface ReviewCardProps {
  review: any;
  onEdit: (review: any) => void;
}

const ReviewCard = ({ review, onEdit }: ReviewCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  console.log("Rendering review card with data:", review);

  // Convert review to coffee format for modal
  const coffee = {
    id: review.coffee_id,
    name: review.coffees?.name || "Unnamed Coffee",
    origin: (review.coffees?.origin || "Ethiopia") as CoffeeOrigin,
    roaster: review.coffees?.roasters?.name || "Unknown Roaster",
    image: review.coffees?.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: review.rating,
    price: review.coffees?.price || 0,
    roastLevel: (review.coffees?.roast_level || "Medium") as RoastLevel,
    processMethod: (review.coffees?.process_method || "Washed") as ProcessMethod,
    flavor: review.review_text || "No flavor notes provided",
    brewingMethod: review.brewing_method || ""
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative overflow-hidden rounded-xl shadow-md group transition-all hover:shadow-xl block aspect-square bg-white cursor-pointer"
      >
        <div className="w-full h-full relative">
          <img 
            src={review.coffees?.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
            alt={review.coffees?.name || "Coffee"} 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
          
          {/* Rating - top right */}
          {review.rating && (
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-base font-medium">{review.rating}</span>
            </div>
          )}
          
          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 z-10 text-white p-4">
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold">{review.coffees?.name || ""}</h3>
              </div>
            </div>
            
            <div className="flex justify-between mb-2">
              {review.coffees?.roasters?.name && (
                <div className="flex items-center text-gray-100 text-sm">
                  <span className="mr-1">☕️</span>
                  <span>{review.coffees.roasters.name}</span>
                </div>
              )}
              {review.coffees?.origin && (
                <div className="flex items-center text-gray-200 text-sm">
                  <span className="mr-1">📍</span>
                  <span>{review.coffees.origin}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20">
              {review.coffees?.roast_level && (
                <div className="flex items-center">
                  <span className="text-base mr-1">{getRoastLevelEmoji(review.coffees.roast_level as RoastLevel)}</span>
                  <div className="text-xs">{review.coffees.roast_level}</div>
                </div>
              )}
              
              {review.coffees?.process_method && (
                <div className="flex items-center">
                  <span className="text-base mr-1">{getProcessMethodEmoji(review.coffees.process_method as ProcessMethod)}</span>
                  <div className="text-xs">{review.coffees.process_method}</div>
                </div>
              )}
              
              {review.coffees?.price !== null && review.coffees?.price !== undefined && (
                <div className="flex items-center justify-end">
                  <span className="text-base mr-1">💰</span>
                  <div className="text-xs">${Number(review.coffees.price).toFixed(2)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CoffeeDetailModal 
        coffee={coffee} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onReview={() => {
          setIsModalOpen(false);
          onEdit(review);
        }}
      />
      
      <ReviewForm 
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        coffeeId={review.coffee_id}
        reviewId={review.id}
        initialData={{
          rating: review.rating || 0,
          reviewText: review.review_text || "",
          brewingMethod: review.brewing_method || ""
        }}
        isEdit={true}
      />
    </>
  );
};

export default ReviewCard;
