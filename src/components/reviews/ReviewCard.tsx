
import { Star, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Coffee } from "@/types/coffee";

interface ReviewCardProps {
  review: any;
  onEdit: (review: any) => void;
}

const ReviewCard = ({ review, onEdit }: ReviewCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full border border-gray-100 flex flex-col">
      {/* Image section with overlay */}
      <div className="relative h-40">
        <img 
          src={review.coffees?.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
          alt={review.coffees?.name || "Coffee"} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="text-white font-medium">{review.rating}</span>
        </div>
        
        {/* Coffee info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-bold truncate">
            {review.coffees?.name || "Unnamed Coffee"}
          </h3>
          <p className="text-sm truncate">
            {review.coffees?.roasters?.name || "Unknown Roaster"}
          </p>
        </div>
      </div>
      
      {/* Review content */}
      <div className="p-4 flex-grow flex flex-col">
        {review.brewing_method && (
          <div className="text-sm mb-2">
            <span className="font-medium text-gray-700">Brewed with:</span> {review.brewing_method}
          </div>
        )}
        
        {review.review_text ? (
          <p className="text-gray-700 text-sm line-clamp-3 mb-3 flex-grow">{review.review_text}</p>
        ) : (
          <p className="text-gray-500 italic text-sm mb-3 flex-grow">No review text provided</p>
        )}
        
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {formatDate(review.created_at)}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-7"
            onClick={() => onEdit(review)}
          >
            <Edit className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
