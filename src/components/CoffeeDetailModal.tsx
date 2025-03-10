
import React, { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Coffee } from '@/types/coffee';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { getRoastLevelEmoji, getProcessMethodEmoji } from '@/utils/coffeeUtils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Coffee Details</DialogTitle>
          <div className="grid md:grid-cols-2">
            {/* Coffee Image Section */}
            <div className="relative h-64 md:h-full">
              <img 
                src={coffee.image} 
                alt={coffee.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Coffee Details Section */}
            <div className="p-6 bg-white">
              <div className="flex items-center mb-2">
                <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{coffee.rating}</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{coffee.name}</h2>
              <p className="text-roast-500 font-medium mb-4">{coffee.roaster}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Origin</div>
                  <div className="font-medium">{coffee.origin}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="font-medium">${coffee.price.toFixed(2)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Roast Level</div>
                  <div className="font-medium flex items-center">
                    <span className="mr-1">{getRoastLevelEmoji(coffee.roastLevel)}</span>
                    {coffee.roastLevel}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Process</div>
                  <div className="font-medium flex items-center">
                    <span className="mr-1">{getProcessMethodEmoji(coffee.processMethod)}</span>
                    {coffee.processMethod}
                  </div>
                </div>
              </div>
              
              {/* Add Type display */}
              {coffee.type && (
                <div className="mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Type</div>
                    <div className="font-medium">{coffee.type}</div>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Your Review</h3>
                <p className="text-gray-700 mb-2">{coffee.flavor || "No review provided yet"}</p>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  {coffee.brewingMethod && (
                    <div>
                      <span className="font-medium">Brewing Method:</span> {coffee.brewingMethod}
                    </div>
                  )}
                  
                  {coffee.reviewDate && (
                    <div>
                      <span>Reviewed on {formatDate(coffee.reviewDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Display custom actions if provided */}
              {customActions ? (
                customActions
              ) : showActionButtons ? (
                <div className="flex flex-col space-y-3">
                  <Button 
                    className="w-full bg-roast-500 hover:bg-roast-600 text-white"
                  >
                    Add to Favorites
                  </Button>
                  
                  <div className="flex space-x-2">
                    {onReview && (
                      <Button 
                        variant="outline"
                        className="flex-1"
                        onClick={onReview}
                      >
                        Edit Review
                      </Button>
                    )}
                    
                    {coffee.reviewId && (
                      <Button 
                        variant="ghost"
                        className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your review of "{coffee.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Review"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CoffeeDetailModal;
