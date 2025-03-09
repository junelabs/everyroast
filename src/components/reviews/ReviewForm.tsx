
import { useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Coffee } from "lucide-react";
import { useReviewForm } from "./hooks/useReviewForm";
import FormLayout from "./form/FormLayout";
import CoffeeDetailsSection from "./form/CoffeeDetailsSection";
import ReviewSection from "./form/ReviewSection";
import ImageUpload from "./form/ImageUpload";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  coffeeId?: string;
  reviewId?: string;
  initialData?: {
    rating: number;
    reviewText: string;
    brewingMethod: string;
  };
  isEdit?: boolean;
}

const ReviewForm = ({ 
  isOpen, 
  onClose, 
  coffeeId, 
  reviewId, 
  initialData, 
  isEdit = false 
}: ReviewFormProps) => {
  
  const form = useReviewForm({
    coffeeId,
    reviewId,
    initialData,
    isEdit,
    onClose
  });

  // Reset form when dialog opens/closes or isEdit changes
  useEffect(() => {
    if (!isOpen) {
      // Give the dialog time to animate closed before resetting form
      setTimeout(() => {
        form.resetForm();
      }, 200);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-roast-500" />
            {isEdit ? "Edit Your Review" : "Share Your Coffee Experience"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update your thoughts about this coffee."
              : "Let the community know what you think about this coffee."
            }
          </DialogDescription>
        </DialogHeader>
        
        <FormLayout 
          isSubmitting={form.isSubmitting}
          onClose={onClose}
          isEdit={isEdit}
          onSubmit={form.handleSubmit}
        >
          {!isEdit && (
            <ImageUpload 
              imageUrl={form.imageUrl}
              setImageUrl={form.setImageUrl}
            />
          )}
          
          {!isEdit ? (
            <CoffeeDetailsSection 
              coffeeName={form.coffeeName}
              setCoffeeName={form.setCoffeeName}
              roaster={form.roaster}
              setRoaster={form.setRoaster}
              origin={form.origin}
              setOrigin={form.setOrigin}
              coffeeType={form.coffeeType}
              setCoffeeType={form.setCoffeeType}
              price={form.price}
              setPrice={form.setPrice}
              size={form.size}
              setSize={form.setSize}
              sizeUnit={form.sizeUnit}
              setSizeUnit={form.setSizeUnit}
              roastLevel={form.roastLevel}
              setRoastLevel={form.setRoastLevel}
              processMethod={form.processMethod}
              setProcessMethod={form.setProcessMethod}
              flavor={form.flavor}
              setFlavor={form.setFlavor}
              origins={form.origins}
              roastLevels={form.roastLevels}
              processMethods={form.processMethods}
              coffeeTypes={form.coffeeTypes}
              sizeUnits={form.sizeUnits}
            />
          ) : (
            <div className="mb-4">
              <h3 className="font-medium">{form.coffeeName}</h3>
              <p className="text-sm text-gray-500">{form.roaster}</p>
            </div>
          )}
          
          <ReviewSection
            rating={form.rating}
            setRating={form.setRating}
            brewingMethod={form.brewingMethod}
            setBrewingMethod={form.setBrewingMethod}
            reviewText={form.reviewText}
            setReviewText={form.setReviewText}
          />
        </FormLayout>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
