
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
  };
  isEdit: boolean;
}

const ReviewFormModal = ({ 
  isOpen, 
  onClose, 
  coffeeId, 
  reviewId, 
  initialData, 
  isEdit 
}: ReviewFormModalProps) => {
  return (
    <ReviewForm 
      isOpen={isOpen} 
      onClose={onClose} 
      coffeeId={coffeeId}
      reviewId={reviewId}
      initialData={initialData}
      isEdit={isEdit}
    />
  );
};

export default ReviewFormModal;
