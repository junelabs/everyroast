
import { useState, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import CoffeeDetailModal from '@/components/CoffeeDetailModal';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewDeleteDialog from './card/ReviewDeleteDialog';
import ReviewActions from './card/ReviewActions';
import { useCoffeeData } from './card/useCoffeeData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { hardDeleteCoffee } from '@/utils/coffeeOperations';

interface ReviewRowCardProps {
  review: any;
  onEdit: (review: any) => void;
  onDelete?: () => void;
}

const ReviewRowCard = ({ review, onEdit, onDelete }: ReviewRowCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteType, setDeleteType] = useState<'review' | 'coffee'>('review');
  const { toast } = useToast();

  // Get coffee data from the review
  const { coffee } = useCoffeeData(review);

  const handleEdit = useCallback(() => {
    onEdit(review);
  }, [review, onEdit]);

  const handleDeleteReview = useCallback(async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', review.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review has been deleted successfully."
      });
      
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
      
      if (onDelete) {
        onDelete();
      }
      
      setIsReviewFormOpen(false);
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete the review. Please try again.",
        variant: "destructive"
      });
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }, [review.id, onDelete, toast]);
  
  const handleDeleteCoffee = useCallback(async () => {
    setIsDeleting(true);
    try {
      const coffeeId = review.coffee_id;
      if (!coffeeId) throw new Error("Coffee ID not found");
      
      const success = await hardDeleteCoffee(coffeeId);
      if (!success) throw new Error("Failed to delete coffee");

      toast({
        title: "Success",
        description: "Coffee has been permanently deleted."
      });
      
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
      
      if (onDelete) {
        onDelete();
      }
      
      setIsReviewFormOpen(false);
    } catch (error) {
      console.error("Error deleting coffee:", error);
      toast({
        title: "Error",
        description: "Failed to delete the coffee. Please try again.",
        variant: "destructive"
      });
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }, [review.coffee_id, onDelete, toast]);
  
  const openDeleteDialog = useCallback((type: 'review' | 'coffee') => {
    setDeleteType(type);
    setIsDeleteDialogOpen(true);
  }, []);

  // Format the date as "X days ago"
  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: false });
    } catch (error) {
      return "some time ago";
    }
  };

  // Render stars for rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="p-4">
          {/* First row: Coffee name and date */}
          <div className="flex justify-between mb-3">
            <h3 className="text-xl font-bold">{coffee.name}</h3>
            <span className="text-sm text-gray-500">
              {review.created_at && `${getTimeAgo(review.created_at)} ago`}
            </span>
          </div>
          
          {/* Content area with image on the right */}
          <div className="flex">
            {/* Left side: Roaster, rating, review text */}
            <div className="flex-1 pr-4">
              {/* Roaster */}
              <div className="text-gray-600 mb-2">
                {coffee.roaster}
              </div>
              
              {/* Rating stars */}
              <div className="mb-2">
                {renderRating(review.rating)}
              </div>
              
              {/* Review text if available */}
              {review.review_text && (
                <p className="text-gray-700 line-clamp-3">{review.review_text}</p>
              )}
            </div>
            
            {/* Right side: Only show image container when an image exists */}
            {coffee.image && coffee.image !== "" && (
              <div className="w-20 h-20 flex-shrink-0">
                <img 
                  src={coffee.image} 
                  alt={coffee.name} 
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      <CoffeeDetailModal 
        coffee={coffee} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onReview={() => {
          setIsModalOpen(false);
          onEdit(review);
        }}
        showActionButtons={true}
        customActions={
          <ReviewActions
            review={review}
            onEdit={handleEdit}
            onOpenDeleteDialog={openDeleteDialog}
            isDeleting={isDeleting}
          />
        }
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

      <ReviewDeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        coffeeName={review.coffees?.name || "this coffee"}
        isDeleting={isDeleting}
        onDelete={deleteType === 'review' ? handleDeleteReview : handleDeleteCoffee}
        deleteType={deleteType}
      />
    </>
  );
};

export default ReviewRowCard;
