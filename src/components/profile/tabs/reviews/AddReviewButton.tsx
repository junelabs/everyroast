
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddReviewButtonProps {
  isLoading: boolean;
  onAddReview: () => void;
}

const AddReviewButton = ({ isLoading, onAddReview }: AddReviewButtonProps) => {
  return (
    <Button 
      onClick={onAddReview} 
      className="bg-roast-500 hover:bg-roast-600 flex items-center gap-2"
      disabled={isLoading}
    >
      <Plus className="h-4 w-4" />
      Add Review
    </Button>
  );
};

export default AddReviewButton;
