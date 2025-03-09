
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { getRoastLevelEmoji, getProcessMethodEmoji } from '@/utils/coffeeUtils';
import CoffeeDetailModal from '@/components/CoffeeDetailModal';
import ReviewForm from '@/components/reviews/ReviewForm';

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

  // Convert review to coffee format for modal
  const coffee = {
    id: review.coffee_id,
    name: review.coffees?.name || "Unnamed Coffee",
    origin: "Unknown Origin", // This might not be in review data
    roaster: review.coffees?.roasters?.name || "Unknown Roaster",
    image: review.coffees?.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: review.rating,
    price: 0, // This might not be in review data
    roastLevel: "Medium", // This might not be in review data
    processMethod: "Washed", // This might not be in review data
    flavor: review.review_text || "No flavor notes provided",
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
          
          {/* Consistent overlay over the whole card */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
          
          {/* Top indicators */}
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-medium">
            <span className="text-lg">{review.id}</span>
          </div>
          
          {/* Rating */}
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-medium">{review.rating}</span>
          </div>
          
          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 z-10 text-white p-4">
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="text-2xl font-bold">{review.coffees?.name || "Unnamed Coffee"}</h3>
              </div>
            </div>
            
            <div className="flex justify-between mb-2">
              <div className="flex items-center text-gray-100">
                <span className="mr-1">☕️</span>
                <span>{review.coffees?.roasters?.name || "Unknown Roaster"}</span>
              </div>
              <div className="flex items-center text-gray-200">
                <span className="mr-1">📍</span>
                <span>Created: {formatDate(review.created_at)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20">
              {review.brewing_method && (
                <div className="flex items-center col-span-2">
                  <span className="text-lg mr-1">⚗️</span>
                  <div className="text-sm truncate">{review.brewing_method}</div>
                </div>
              )}
              
              <div className="flex items-center justify-end col-span-1">
                <div 
                  className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs cursor-pointer hover:bg-white/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(review);
                  }}
                >
                  Edit
                </div>
              </div>
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
          setIsReviewFormOpen(true);
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
