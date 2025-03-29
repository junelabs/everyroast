
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
    const isRatingValid = form.rating > 0;
    
    setCoffeeInfoValidation({
      attempted: true,
      isValid: isNameValid && isRoasterValid && isRatingValid
    });
    
    if (!isRatingValid) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before proceeding.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!isNameValid || !isRoasterValid) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
      return false;
    }
    
    return isNameValid && isRoasterValid && isRatingValid;
  };

  // Validate brewing step - this step is optional, so we always return true
  const validateBrewingStep = () => {
    return true;
  };

  const handleNextStep = () => {
    // Validate current step before moving to next
    let canProceed = false;
    
    if (currentStep === FORM_STEPS.COFFEE_INFO) {
      canProceed = validateCoffeeInfo();
    } else if (currentStep === FORM_STEPS.BREW_INFO) {
      canProceed = validateBrewingStep();
    } else {
      canProceed = true;
    }
    
    if (canProceed) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.BREW_INFO));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, isEdit ? FORM_STEPS.COFFEE_INFO : FORM_STEPS.SELECT_COFFEE));
  };

  const handleSelectCoffee = (id: string) => {
    setSelectedCoffeeId(id);
    setCurrentStep(FORM_STEPS.COFFEE_INFO); // Go to coffee info when selecting existing coffee
  };

  const handleAddNewCoffee = () => {
    setSelectedCoffeeId(undefined);
    setCurrentStep(FORM_STEPS.COFFEE_INFO);
  };

  // Handle submit for final step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For the final step (BREW_INFO), proceed with form submission
    if (currentStep === FORM_STEPS.BREW_INFO) {
      return form.handleSubmit(e);
    }
    
    // For the COFFEE_INFO step, validate and move to next step
    if (currentStep === FORM_STEPS.COFFEE_INFO) {
      setAttemptedSubmit(true);
      if (validateCoffeeInfo()) {
        handleNextStep();
      }
    }
    
    return Promise.resolve();
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
            totalSteps={2}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            showStepIndicator={currentStep > FORM_STEPS.SELECT_COFFEE}
            isLastStep={currentStep === FORM_STEPS.BREW_INFO}
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
                
                {/* Add Rating and Review section to the Coffee Info step */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-md font-medium mb-3">Your Review</h3>
                  <ReviewSection
                    rating={form.rating}
                    setRating={form.setRating}
                    reviewText={form.reviewText}
                    setReviewText={form.setReviewText}
                    brewingMethod={form.brewingMethod}
                    setBrewingMethod={form.setBrewingMethod}
                    showRatingError={attemptedSubmit && form.rating === 0}
                  />
                </div>
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
          </FormLayout>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
