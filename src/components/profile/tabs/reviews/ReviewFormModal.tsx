
import ReviewForm from "@/components/reviews/ReviewForm";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  coffeeId?: string;
  reviewId?: string;
  initialData: {
    rating: number;
    reviewText: string;
    brewingMethod: string;
    dosage?: number;
    water?: number;
    temperature?: number;
    brewTime?: string;
    brewNotes?: string;
  };
  isEdit: boolean;
  reviewCount: number;
}

const ReviewFormModal = ({ 
  isOpen, 
  onClose, 
  coffeeId, 
  reviewId, 
  initialData, 
  isEdit,
  reviewCount 
}: ReviewFormModalProps) => {
  // Always set showSelector to false when in edit mode
  return (
    <ReviewForm 
      isOpen={isOpen} 
      onClose={onClose} 
      coffeeId={coffeeId}
      reviewId={reviewId}
      initialData={initialData}
      isEdit={isEdit}
      reviewCount={reviewCount}
      showSelector={isEdit ? false : (!isEdit && !coffeeId)} // Force false for edit mode
    />
  );
};

export default ReviewFormModal;
