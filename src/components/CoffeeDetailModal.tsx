import React, { useState } from 'react';
import { Coffee } from '@/types/coffee';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { hardDeleteCoffee, softDeleteCoffee, canDeleteCoffee } from '@/utils/coffeeOperations';
import { useAuth } from '@/context/auth';
import ImageSection from '@/components/coffee/modal/ImageSection';
import RatingBadge from '@/components/coffee/modal/RatingBadge';
import CoffeeAttributes from '@/components/coffee/modal/CoffeeAttributes';
import ReviewSection from '@/components/coffee/modal/ReviewSection';
import ActionButtons from '@/components/coffee/modal/ActionButtons';
import DeleteConfirmDialog from '@/components/coffee/modal/DeleteConfirmDialog';
import { Star } from 'lucide-react';

interface CoffeeDetailModalProps {
  coffee: Coffee & { reviewDate?: string; reviewId?: string };
  isOpen: boolean;
  onClose: () => void;
  onReview?: () => void;
  showActionButtons?: boolean;
  customActions?: React.ReactNode;
}

const CoffeeDetailModal: React.FC<CoffeeDetailModalProps> = ({ 
  coffee, 
  isOpen, 
  onClose,
  onReview,
  showActionButtons = false,
  customActions 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'review' | 'coffee'>('review');
  const [useHardDelete, setUseHardDelete] = useState(false); // Default to soft delete

  const handleDeleteReview = async () => {
    if (!coffee.reviewId) {
      toast({
        title: "Error",
        description: "Cannot delete review: review ID not found.",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', coffee.reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review has been deleted successfully."
      });
      
      // Close dialogs
      setIsDeleteDialogOpen(false);
      onClose(); // Close the main modal
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
  };
  
  const handleDeleteCoffee = async () => {
    if (!coffee.id) {
      toast({
        title: "Error",
        description: "Cannot delete coffee: coffee ID not found.",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    try {
      const coffeeId = typeof coffee.id === 'number' ? coffee.id.toString() : coffee.id;
      
      // Use soft delete by default
      const deleteFunction = useHardDelete ? hardDeleteCoffee : softDeleteCoffee;
      const deleted = await deleteFunction(coffeeId);
      
      if (!deleted) throw new Error("Failed to delete coffee");

      toast({
        title: "Success",
        description: useHardDelete 
          ? "Coffee has been permanently deleted." 
          : "Coffee has been removed from your listings."
      });
      
      // Close dialogs
      setIsDeleteDialogOpen(false);
      onClose(); // Close the main modal
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
  };
  
  const openDeleteDialog = (type: 'review' | 'coffee', hardDelete: boolean = false) => {
    setDeleteType(type);
    setUseHardDelete(hardDelete);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteType === 'review') {
      handleDeleteReview();
    } else {
      handleDeleteCoffee();
    }
  };

  const handleUpvote = () => {
    toast({
      title: "Upvoted!",
      description: `You upvoted ${coffee.name}`,
      duration: 3000,
    });
  };
  
  const canDelete = coffee.poster && user && coffee.poster.userId ? 
    canDeleteCoffee(coffee.poster.userId, user.id) : false;

  console.log('Coffee data in modal:', coffee);
  console.log('Current user:', user);
  console.log('Can delete coffee:', canDelete);

  // Render stars for the rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleViewProfile = () => {
    if (coffee.poster && coffee.poster.userId) {
      onClose();
      navigate(`/profile/${coffee.poster.userId}`);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl p-6 overflow-auto max-h-[90vh]">
          <DialogTitle className="sr-only">Coffee Details</DialogTitle>
          
          <div className="flex items-start gap-4 mb-6">
            {/* Image section - only if image exists, now inline */}
            {coffee.image && (
              <ImageSection imageSrc={coffee.image} altText={coffee.name} />
            )}
            
            <div className="flex-1">
              <div className="mb-2">
                {/* Coffee name and rating side by side */}
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{coffee.name}</h2>
                  
                  {/* Stars rating display - positioned beside the coffee name */}
                  {coffee.rating > 0 && (
                    <div className="flex items-center ml-4">
                      {renderRating(coffee.rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        {coffee.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-roast-500 font-medium">{coffee.roaster}</p>
              </div>
            </div>
          </div>
          
          {/* Coffee attributes */}
          <div className="mb-6">
            <CoffeeAttributes
              origin={coffee.origin}
              price={coffee.price}
              roastLevel={coffee.roastLevel}
              processMethod={coffee.processMethod}
              type={coffee.type}
            />
          </div>
          
          {/* Review information */}
          <div className="mb-6">
            <ReviewSection
              flavor={coffee.flavor}
              brewingMethod={coffee.brewingMethod}
              reviewDate={coffee.reviewDate}
            />
          </div>
          
          {/* Added poster information with clickable profile */}
          {coffee.poster && coffee.poster.userId && (
            <div className="flex items-center mb-6 p-3 bg-gray-50 rounded-md">
              <div 
                className="flex items-center cursor-pointer" 
                onClick={handleViewProfile}
              >
                <Avatar className="h-8 w-8 mr-3">
                  {coffee.poster.avatarUrl ? (
                    <AvatarImage src={coffee.poster.avatarUrl} alt={coffee.poster.username} />
                  ) : (
                    <AvatarFallback>
                      {coffee.poster.username ? coffee.poster.username[0].toUpperCase() : 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-blue-600 hover:underline">
                    {coffee.poster.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    Coffee added by
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <ActionButtons
            showActionButtons={showActionButtons}
            customActions={customActions}
            onReview={onReview}
            onDelete={coffee.reviewId ? () => openDeleteDialog('review') : canDelete ? () => openDeleteDialog('coffee', false) : undefined}
            onUpvote={handleUpvote}
            isDeleting={isDeleting}
            hasReviewId={!!coffee.reviewId}
            hasCoffeeId={canDelete}
            upvotes={coffee.upvotes}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        coffeeName={coffee.name}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        deleteType={deleteType}
      />
    </>
  );
};

export default CoffeeDetailModal;
