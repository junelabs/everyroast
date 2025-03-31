
import React, { useState, useCallback } from 'react';
import CoffeeDetailModal from '@/components/CoffeeDetailModal';
import ReviewForm from '@/components/reviews/ReviewForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { hardDeleteCoffee } from '@/utils/coffeeOperations';

// Import refactored components
import ReviewCardImage from './card/ReviewCardImage';
import ReviewDeleteDialog from './card/ReviewDeleteDialog';
import ReviewActions from './card/ReviewActions';
import { useCoffeeData, formatReviewDate } from './card/useCoffeeData';

interface ReviewCardProps {
  review: any;
  onEdit: (review: any) => void;
  onDelete?: () => void;
}

const ReviewCard = React.memo(({ review, onEdit, onDelete }: ReviewCardProps) => {
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

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative overflow-hidden rounded-xl shadow-md group transition-all hover:shadow-xl block bg-white cursor-pointer aspect-square h-full w-full"
      >
        <ReviewCardImage 
          review={review} 
          formatDate={formatReviewDate} 
        />
      </div>

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
          brewingMethod: review.brewing_method || "",
          dosage: review.dosage || 0,
          water: review.water || 0,
          temperature: review.temperature || 0,
          brewTime: review.brew_time || "",
          brewNotes: review.brew_notes || ""
        }}
        isEdit={true}
        showSelector={false} // Explicitly set to false
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
});

ReviewCard.displayName = 'ReviewCard';

export default ReviewCard;
