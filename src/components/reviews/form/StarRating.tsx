
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  showError?: boolean;
}

const StarRating = ({ rating, onRatingChange, showError = false }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="space-y-2">
      <label htmlFor="rating" className="block text-sm font-medium">
        Rating *
      </label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star 
              className={`h-6 w-6 ${
                (hoverRating || rating) >= star 
                  ? "text-yellow-400 fill-yellow-400" 
                  : showError ? "text-red-400" : "text-gray-300"
              }`} 
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-500">
          {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
        </span>
      </div>
    </div>
  );
};

export default StarRating;
