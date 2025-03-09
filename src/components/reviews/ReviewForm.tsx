
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Coffee } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  coffeeId?: string;
}

const ReviewForm = ({ isOpen, onClose, coffeeId }: ReviewFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [brewingMethod, setBrewingMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review.",
        variant: "destructive"
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          coffee_id: coffeeId,
          user_id: user.id,
          rating,
          review_text: reviewText,
          brewing_method: brewingMethod || null
        });
        
      if (error) throw error;
      
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience!",
      });
      
      // Reset form
      setRating(0);
      setReviewText("");
      setBrewingMethod("");
      onClose();
      
      // Refresh the profile reviews tab
      navigate("/profile");
      
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-roast-500" />
            Share Your Coffee Experience
          </DialogTitle>
          <DialogDescription>
            Let the community know what you think about this coffee.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="rating" className="block text-sm font-medium">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star 
                    className={`h-6 w-6 ${
                      (hoverRating || rating) >= star 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="brewingMethod" className="block text-sm font-medium">
              Brewing Method (optional)
            </label>
            <Input
              id="brewingMethod"
              placeholder="e.g., Pour Over, French Press, Espresso"
              value={brewingMethod}
              onChange={(e) => setBrewingMethod(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="reviewText" className="block text-sm font-medium">
              Your Review
            </label>
            <textarea
              id="reviewText"
              rows={4}
              placeholder="Share your thoughts about this coffee..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-roast-500"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-roast-500 hover:bg-roast-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
