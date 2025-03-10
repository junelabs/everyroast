import React, { useState } from 'react';
import { Coffee } from '@/types/coffee';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { softDeleteCoffee, canDeleteCoffee } from '@/utils/coffeeOperations';
import { useAuth } from '@/context/auth';

// Import our component modules
import ImageSection from './coffee/modal/ImageSection';
import RatingBadge from './coffee/modal/RatingBadge';
import CoffeeAttributes from './coffee/modal/CoffeeAttributes';
import ReviewSection from './coffee/modal/ReviewSection';
import ActionButtons from './coffee/modal/ActionButtons';
import DeleteConfirmDialog from './coffee/modal/DeleteConfirmDialog';

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
      onClose();
      navigate('/profile', { replace: true });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete the review. Please try again.",
        variant: "destructive"
      });
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
      const deleted = await softDeleteCoffee(coffeeId);
      
      if (!deleted) throw new Error("Failed to delete coffee");

      toast({
        title: "Success",
        description: "Coffee has been deleted successfully."
      });
      onClose();
      navigate('/profile', { replace: true });
    } catch (error) {
      console.error("Error deleting coffee:", error);
      toast({
        title: "Error",
        description: "Failed to delete the coffee. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
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

  const handleUpvote = () => {
    toast({
      title: "Upvoted!",
      description: `You upvoted ${coffee.name}`,
      duration: 3000,
    });
  };
  
  // Check if the current user is the owner of this coffee
  const canDelete = coffee.poster && user && coffee.poster.userId ? 
    canDeleteCoffee(coffee.poster.userId, user.id) : false;

  // Debug logging
  console.log('Coffee data in modal:', coffee);
  console.log('Current user:', user);
  console.log('Can delete coffee:', canDelete);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Coffee Details</DialogTitle>
          <div className="grid md:grid-cols-2">
            {/* Coffee Image Section */}
            <ImageSection imageSrc={coffee.image} altText={coffee.name} />
            
            {/* Coffee Details Section */}
            <div className="p-6 bg-white">
              {/* Moved poster information to top */}
              {coffee.poster && (
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-gray-500">Posted by:</span>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={coffee.poster.avatarUrl} />
                    <AvatarFallback>{coffee.poster.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">@{coffee.poster.username}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-3 mb-2">
                <RatingBadge rating={coffee.rating} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{coffee.name}</h2>
              <p className="text-roast-500 font-medium mb-4">{coffee.roaster}</p>
              
              <CoffeeAttributes
                origin={coffee.origin}
                price={coffee.price}
                roastLevel={coffee.roastLevel}
                processMethod={coffee.processMethod}
                type={coffee.type}
              />
              
              <ReviewSection
                flavor={coffee.flavor}
                brewingMethod={coffee.brewingMethod}
                reviewDate={coffee.reviewDate}
              />
              
              <ActionButtons
                showActionButtons={showActionButtons}
                customActions={customActions}
                onReview={onReview}
                onDelete={coffee.reviewId ? () => openDeleteDialog('review') : canDelete ? () => openDeleteDialog('coffee') : undefined}
                onUpvote={handleUpvote}
                isDeleting={isDeleting}
                hasReviewId={!!coffee.reviewId}
                hasCoffeeId={canDelete}
                upvotes={coffee.upvotes}
              />
            </div>
          </div>
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
