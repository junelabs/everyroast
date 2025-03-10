
import React, { useState } from 'react';
import CoffeeDetailModal from '@/components/CoffeeDetailModal';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { softDeleteCoffee } from '@/utils/coffeeOperations';
import { useAuth } from '@/context/auth';

// Import refactored components
import ReviewCardImage from './card/ReviewCardImage';
import ReviewDeleteDialog from './card/ReviewDeleteDialog';
import { useCoffeeData, formatReviewDate } from './card/useCoffeeData';

interface ReviewCardProps {
  review: any;
  onEdit: (review: any) => void;
}

const ReviewCard = ({ review, onEdit }: ReviewCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteType, setDeleteType] = useState<'review' | 'coffee'>('review');
  const { toast } = useToast();
  const { user } = useAuth();

  // Debug logging to check the review data
  console.log("Review in ReviewCard:", review);
  console.log("Coffee type in ReviewCard:", review.coffees?.type);

  // Get coffee data from the review
  const { coffee } = useCoffeeData(review);
  
  // Check if the current user is the owner of this coffee
  const isOwner = user && review.coffees?.created_by === user.id;

  const handleEdit = () => {
    onEdit(review);
  };

  const handleDeleteReview = async () => {
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
      onEdit(null);
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete the review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleDeleteCoffee = async () => {
    setIsDeleting(true);
    try {
      // Get the coffee ID from the review
      const coffeeId = review.coffee_id;
      if (!coffeeId) throw new Error("Coffee ID not found");
      
      const success = await softDeleteCoffee(coffeeId);
      if (!success) throw new Error("Failed to delete coffee");

      toast({
        title: "Success",
        description: "Coffee has been deleted successfully."
      });
      onEdit(null);
    } catch (error) {
      console.error("Error deleting coffee:", error);
      toast({
        title: "Error",
        description: "Failed to delete the coffee. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const openDeleteDialog = (type: 'review' | 'coffee') => {
    setDeleteType(type);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (deleteType === 'review') {
      handleDeleteReview();
    } else {
      handleDeleteCoffee();
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative overflow-hidden rounded-xl shadow-md group transition-all hover:shadow-xl block aspect-square bg-white cursor-pointer"
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
          <div className="space-y-3 mt-4">
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={handleEdit}
              >
                Edit Review
              </Button>
              
              <Button 
                variant="ghost"
                className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                onClick={() => openDeleteDialog('review')}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Review"}
              </Button>
            </div>
            
            {isOwner && (
              <Button 
                variant="destructive"
                className="w-full"
                onClick={() => openDeleteDialog('coffee')}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting Coffee..." : "Delete Coffee Post"}
              </Button>
            )}
          </div>
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
        onDelete={handleDelete}
        deleteType={deleteType}
      />
    </>
  );
};

export default ReviewCard;
