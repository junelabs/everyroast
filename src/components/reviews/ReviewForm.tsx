
import { useEffect, useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Coffee, CupSoda, Info } from "lucide-react";
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

// Define steps for the multi-step form
const FORM_STEPS = {
  COFFEE_INFO: 0,
  BREW_INFO: 1,
  REVIEW_INFO: 2
};

const ReviewForm = ({ 
  isOpen, 
  onClose, 
  coffeeId, 
  reviewId, 
  initialData, 
  isEdit = false 
}: ReviewFormProps) => {
  
  const [currentStep, setCurrentStep] = useState(FORM_STEPS.COFFEE_INFO);
  const form = useReviewForm({
    coffeeId,
    reviewId,
    initialData,
    isEdit,
    onClose
  });

  // Reset form and step when dialog opens/closes or isEdit changes
  useEffect(() => {
    if (!isOpen) {
      // Give the dialog time to animate closed before resetting form
      setTimeout(() => {
        form.resetForm();
        setCurrentStep(FORM_STEPS.COFFEE_INFO);
      }, 200);
    }
  }, [isOpen]);

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.REVIEW_INFO));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, FORM_STEPS.COFFEE_INFO));
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case FORM_STEPS.COFFEE_INFO:
        return <Coffee className="h-5 w-5 text-roast-500" />;
      case FORM_STEPS.BREW_INFO:
        return <CupSoda className="h-5 w-5 text-roast-500" />;
      case FORM_STEPS.REVIEW_INFO:
        return <Info className="h-5 w-5 text-roast-500" />;
      default:
        return <Coffee className="h-5 w-5 text-roast-500" />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case FORM_STEPS.COFFEE_INFO:
        return isEdit ? "Edit Coffee Details" : "Enter Coffee Details";
      case FORM_STEPS.BREW_INFO:
        return "Brewing Information";
      case FORM_STEPS.REVIEW_INFO:
        return "Your Review";
      default:
        return "Coffee Log";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case FORM_STEPS.COFFEE_INFO:
        return "Tell us about the coffee you're logging";
      case FORM_STEPS.BREW_INFO:
        return "How did you brew this coffee?";
      case FORM_STEPS.REVIEW_INFO:
        return "Share your thoughts about this coffee";
      default:
        return "Log your coffee experience";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStepIcon()}
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription>
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <FormLayout 
          isSubmitting={form.isSubmitting}
          onClose={onClose}
          isEdit={isEdit}
          onSubmit={form.handleSubmit}
          currentStep={currentStep}
          totalSteps={3}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        >
          {currentStep === FORM_STEPS.COFFEE_INFO && (
            <>
              {!isEdit && (
                <ImageUpload 
                  imageUrl={form.imageUrl}
                  setImageUrl={form.setImageUrl}
                />
              )}
              
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
                readOnly={false}
              />
            </>
          )}
          
          {currentStep === FORM_STEPS.BREW_INFO && (
            <div className="space-y-4">
              <h3 className="font-medium">Brewing Method</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="brewing-method" className="text-sm font-medium">
                    Brewing Method
                  </label>
                  <input
                    id="brewing-method"
                    type="text"
                    value={form.brewingMethod}
                    onChange={(e) => form.setBrewingMethod(e.target.value)}
                    placeholder="French Press, V60, Espresso, etc."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-roast-500"
                  />
                </div>
                {/* Additional brew details would go here in future versions */}
              </div>
            </div>
          )}
          
          {currentStep === FORM_STEPS.REVIEW_INFO && (
            <ReviewSection
              rating={form.rating}
              setRating={form.setRating}
              brewingMethod={form.brewingMethod}
              setBrewingMethod={form.setBrewingMethod}
              reviewText={form.reviewText}
              setReviewText={form.setReviewText}
            />
          )}
        </FormLayout>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
