import { useEffect, useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useReviewForm } from "./hooks/useReviewForm";
import FormLayout from "./form/FormLayout";
import CoffeeDetailsSection from "./form/CoffeeDetailsSection";
import ReviewSection from "./form/ReviewSection";
import ImageUpload from "./form/ImageUpload";
import { useAuth } from "@/context/auth";
import RecentCoffeesSelector from "./form/RecentCoffeesSelector";
import { FORM_STEPS, getStepInfo } from "./form/StepManager";
import BrewingMethodInput from "./form/BrewingMethodInput";
import { toast } from "@/components/ui/use-toast";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  coffeeId?: string;
  reviewId?: string;
  initialData?: {
    rating: number;
    reviewText: string;
    brewingMethod: string;
    dosage?: number;
    water?: number;
    temperature?: number;
    brewTime?: string;
    brewNotes?: string;
  };
  isEdit?: boolean;
  reviewCount?: number;
}

const ReviewForm = ({ 
  isOpen, 
  onClose, 
  coffeeId, 
  reviewId, 
  initialData, 
  isEdit = false,
  reviewCount = 0
}: ReviewFormProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(isEdit ? FORM_STEPS.COFFEE_INFO : FORM_STEPS.SELECT_COFFEE);
  const [selectedCoffeeId, setSelectedCoffeeId] = useState<string | undefined>(coffeeId);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [coffeeInfoValidation, setCoffeeInfoValidation] = useState({
    attempted: false,
    isValid: false
  });
  
  const form = useReviewForm({
    coffeeId: selectedCoffeeId,
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
        setCurrentStep(isEdit ? FORM_STEPS.COFFEE_INFO : FORM_STEPS.SELECT_COFFEE);
        setSelectedCoffeeId(coffeeId);
        setAttemptedSubmit(false);
        setCoffeeInfoValidation({ attempted: false, isValid: false });
      }, 200);
    }
  }, [isOpen]);

  // Validate coffee info step
  const validateCoffeeInfo = () => {
    const isNameValid = form.coffeeName.trim().length > 0;
    const isRoasterValid = form.roaster.trim().length > 0;
    
    setCoffeeInfoValidation({
      attempted: true,
      isValid: isNameValid && isRoasterValid
    });
    
    return isNameValid && isRoasterValid;
  };

  // Validate brewing step - this step is optional, so we always return true
  const validateBrewingStep = () => {
    return true;
  };

  // Validate review step
  const validateReviewStep = () => {
    return form.rating > 0;
  };

  const handleNextStep = () => {
    // Validate current step before moving to next
    let canProceed = false;
    
    if (currentStep === FORM_STEPS.COFFEE_INFO) {
      canProceed = validateCoffeeInfo();
      if (!canProceed) {
        toast({
          title: "Required Fields",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive"
        });
      }
    } else if (currentStep === FORM_STEPS.BREW_INFO) {
      canProceed = validateBrewingStep();
    } else {
      canProceed = true;
    }
    
    if (canProceed) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.REVIEW_INFO));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, isEdit ? FORM_STEPS.COFFEE_INFO : FORM_STEPS.SELECT_COFFEE));
  };

  const handleSelectCoffee = (id: string) => {
    setSelectedCoffeeId(id);
    setCurrentStep(FORM_STEPS.REVIEW_INFO); // Skip to review info when selecting existing coffee
  };

  const handleAddNewCoffee = () => {
    setSelectedCoffeeId(undefined);
    setCurrentStep(FORM_STEPS.COFFEE_INFO);
  };

  // Update the handleSubmit function to handle validation without toast for rating
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set attemptedSubmit to true ONLY when trying to submit the final review step
    if (currentStep === FORM_STEPS.REVIEW_INFO) {
      setAttemptedSubmit(true);
      
      // Only proceed if rating is valid, but don't show toast anymore
      if (!validateReviewStep()) {
        return Promise.resolve(); // Return resolved promise but don't proceed
      }
    }
    
    return form.handleSubmit(e);
  };

  // Get current step information
  const stepInfo = getStepInfo({ currentStep, isEdit });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {stepInfo.icon}
            {stepInfo.title}
          </DialogTitle>
          <DialogDescription>
            {stepInfo.description}
          </DialogDescription>
        </DialogHeader>
        
        {currentStep === FORM_STEPS.SELECT_COFFEE ? (
          <RecentCoffeesSelector
            reviewCount={reviewCount}
            onSelectCoffee={handleSelectCoffee}
            onAddNewCoffee={handleAddNewCoffee}
            onClose={onClose}
          />
        ) : (
          <FormLayout 
            isSubmitting={form.isSubmitting}
            onClose={onClose}
            isEdit={isEdit}
            onSubmit={handleSubmit}
            currentStep={currentStep - 1} // Adjust since we're skipping the first step in the step indicator
            totalSteps={3}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            showStepIndicator={currentStep > FORM_STEPS.SELECT_COFFEE}
          >
            {currentStep === FORM_STEPS.COFFEE_INFO && (
              <>
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
                  hidePriceSize={true}
                  showValidationErrors={coffeeInfoValidation.attempted}
                />
                
                {!isEdit && (
                  <ImageUpload 
                    imageUrl={form.imageUrl}
                    setImageUrl={form.setImageUrl}
                  />
                )}
              </>
            )}
            
            {currentStep === FORM_STEPS.BREW_INFO && (
              <BrewingMethodInput
                brewingMethod={form.brewingMethod}
                setBrewingMethod={form.setBrewingMethod}
                dosage={form.dosage}
                setDosage={form.setDosage}
                water={form.water}
                setWater={form.setWater}
                temperature={form.temperature}
                setTemperature={form.setTemperature}
                brewTime={form.brewTime}
                setBrewTime={form.setBrewTime}
                brewNotes={form.brewNotes}
                setBrewNotes={form.setBrewNotes}
              />
            )}
            
            {currentStep === FORM_STEPS.REVIEW_INFO && (
              <ReviewSection
                rating={form.rating}
                setRating={form.setRating}
                reviewText={form.reviewText}
                setReviewText={form.setReviewText}
                brewingMethod={form.brewingMethod}
                setBrewingMethod={form.setBrewingMethod}
                showRatingError={attemptedSubmit && form.rating === 0}
              />
            )}
          </FormLayout>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
