
import React, { useState } from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';
import { getRoastLevelEmoji, getProcessMethodEmoji } from '@/utils/coffeeUtils';
import CoffeeDetailModal from '@/components/CoffeeDetailModal';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Button } from '@/components/ui/button';
import { CoffeeOrigin, RoastLevel, ProcessMethod } from '@/types/coffee';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
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

interface ReviewCardProps {
  review: any;
  onEdit: (review: any) => void;
}

const ReviewCard = ({ review, onEdit }: ReviewCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Convert review to coffee format for modal
  const coffee = {
    id: review.coffee_id,
    name: review.coffees?.name || "Unnamed Coffee",
    origin: (review.coffees?.origin || "Ethiopia") as CoffeeOrigin,
    roaster: review.coffees?.roasters?.name || "Unknown Roaster",
    image: review.coffees?.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: review.rating,
    price: review.coffees?.price || 0,
    roastLevel: (review.coffees?.roast_level || "Medium") as RoastLevel,
    processMethod: (review.coffees?.process_method || "Washed") as ProcessMethod,
    flavor: review.review_text || "No flavor notes provided",
    brewingMethod: review.brewing_method || "",
    reviewDate: review.created_at,
    reviewId: review.id // Pass the review ID to the modal
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    onEdit(review);
  };

  const handleDelete = async () => {
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
      // This will cause the parent component to refresh the reviews list
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

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative overflow-hidden rounded-xl shadow-md group transition-all hover:shadow-xl block aspect-square bg-white cursor-pointer"
      >
        <div className="w-full h-full relative">
          <img 
            src={review.coffees?.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
            alt={review.coffees?.name || "Coffee"} 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
          
          {/* Rating - top right */}
          {review.rating && (
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-base font-medium">{review.rating}</span>
            </div>
          )}
          
          {/* Date - top left */}
          {review.created_at && (
            <div className="absolute top-4 left-4 z-10 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
              {formatDate(review.created_at)}
            </div>
          )}
          
          {/* Action buttons - bottom right */}
          <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-transparent text-white h-8 px-2"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-transparent text-white h-8 px-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 z-10 text-white p-4">
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold">{review.coffees?.name || ""}</h3>
              </div>
            </div>
            
            <div className="flex justify-between mb-2">
              {review.coffees?.roasters?.name && (
                <div className="flex items-center text-gray-100 text-sm">
                  <span className="mr-1">☕️</span>
                  <span>{review.coffees.roasters.name}</span>
                </div>
              )}
              {review.coffees?.origin && (
                <div className="flex items-center text-gray-200 text-sm">
                  <span className="mr-1">📍</span>
                  <span>{review.coffees.origin}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20">
              {review.coffees?.roast_level && (
                <div className="flex items-center">
                  <span className="text-base mr-1">{getRoastLevelEmoji(review.coffees.roast_level as RoastLevel)}</span>
                  <div className="text-xs">{review.coffees.roast_level}</div>
                </div>
              )}
              
              {review.coffees?.process_method && (
                <div className="flex items-center">
                  <span className="text-base mr-1">{getProcessMethodEmoji(review.coffees.process_method as ProcessMethod)}</span>
                  <div className="text-xs">{review.coffees.process_method}</div>
                </div>
              )}
              
              {review.coffees?.price !== null && review.coffees?.price !== undefined && (
                <div className="flex items-center justify-end">
                  <span className="text-base mr-1">💰</span>
                  <div className="text-xs">${Number(review.coffees.price).toFixed(2)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your review of "{review.coffees?.name}". This action cannot be undone.
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

export default ReviewCard;
