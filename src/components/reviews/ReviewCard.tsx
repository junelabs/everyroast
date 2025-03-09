
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
      {/* Image section with overlay and review text */}
      <div className="relative h-48">
        <img 
          src={review.coffees?.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
          alt={review.coffees?.name || "Coffee"} 
          className="w-full h-full object-cover brightness-90"
        />
        {/* Enhanced overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
        
        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center bg-roast-500/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="h-3 w-3 text-white fill-white mr-1" />
          <span className="text-white font-medium text-xs">{review.rating}</span>
        </div>
        
        {/* Coffee info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
          <h3 className="font-bold truncate text-sm">
            {review.coffees?.name || "Unnamed Coffee"}
          </h3>
          <p className="text-xs truncate mb-1">
            {review.coffees?.roasters?.name || "Unknown Roaster"}
          </p>
          
          {/* Brewing method on image */}
          {review.brewing_method && (
            <div className="text-xs mb-1 text-white/90">
              <span className="font-medium">Brewed with:</span> {review.brewing_method}
            </div>
          )}
          
          {/* Review text on image */}
          {review.review_text ? (
            <p className="text-white/80 text-xs line-clamp-3 mb-1">{review.review_text}</p>
          ) : (
            <p className="text-white/70 italic text-xs mb-1">No review text provided</p>
          )}
        </div>
      </div>
      
      {/* Footer with date and edit button */}
      <div className="px-2 py-1.5 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {formatDate(review.created_at)}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0.5 h-6"
          onClick={() => onEdit(review)}
        >
          <Edit className="h-3.5 w-3.5 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

export default ReviewCard;
