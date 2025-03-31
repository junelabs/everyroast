
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
import { Progress } from "@/components/ui/progress";

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
  showSelector?: boolean; // Prop to control selector visibility
}

const ReviewForm = ({ 
  isOpen, 
  onClose, 
  coffeeId, 
  reviewId, 
  initialData, 
  isEdit = false,
  reviewCount = 0,
  showSelector: initialShowSelector // Use the prop as initial state
}: ReviewFormProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(FORM_STEPS.COFFEE_INFO);
  const [selectedCoffeeId, setSelectedCoffeeId] = useState<string | undefined>(coffeeId);
  
  // If we're in edit mode, always set showSelector to false
  // Otherwise, use the provided initialShowSelector or calculate based on coffeeId
  const [showSelector, setShowSelector] = useState<boolean>(
    isEdit ? false : (initialShowSelector !== undefined ? initialShowSelector : (!coffeeId && !isEdit))
  );
  
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
        setCurrentStep(FORM_STEPS.COFFEE_INFO);
        setSelectedCoffeeId(coffeeId);
        
        // Always set showSelector to false in edit mode
        setShowSelector(isEdit ? false : initialShowSelector ?? (!coffeeId && !isEdit));
        
        setAttemptedSubmit(false);
        setCoffeeInfoValidation({ attempted: false, isValid: false });
      }, 200);
    }
  }, [isOpen, coffeeId, isEdit, initialShowSelector]);

  // Validate coffee info step
  const validateCoffeeInfo = () => {
    // Skip validation in edit mode since coffee details shouldn't be editable
    if (isEdit) return true;
    
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

  // Calculate recipe completeness for popular brewing methods
  const calculateRecipeCompleteness = () => {
    const popularMethods = ["V60", "AeroPress", "Chemex", "French Press", "Espresso"];
    if (!popularMethods.some(method => form.brewingMethod.includes(method))) {
      return null;
    }
    
    let filledFields = 0;
    let totalFields = 5;
    
    if (form.brewingMethod) filledFields++;
    if (form.dosage) filledFields++;
    if (form.water) filledFields++;
    if (form.brewTime) filledFields++;
    if (form.temperature) filledFields++;
    
    return {
      filled: filledFields,
      total: totalFields,
      percentage: (filledFields / totalFields) * 100
    };
  };

  const recipeCompleteness = calculateRecipeCompleteness();

  const handleNextStep = () => {
    // Validate current step before moving to next
    let canProceed = false;
    
    if (currentStep === FORM_STEPS.COFFEE_INFO) {
      canProceed = validateCoffeeInfo();
    } else {
      canProceed = true;
    }
    
    if (canProceed) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.BREW_INFO));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(FORM_STEPS.COFFEE_INFO);
  };

  const handleSelectCoffee = (id: string) => {
    setSelectedCoffeeId(id);
    setShowSelector(false);
  };

  const handleAddNewCoffee = () => {
    setSelectedCoffeeId(undefined);
    setShowSelector(false);
  };

  // Handle submit for final step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // When editing, we can just submit the form without going through steps
    if (isEdit) {
      return form.handleSubmit(e);
    }
    
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

  // For edit mode, we don't need the two-step process - just show the review form
  const showDirectEditForm = isEdit;

  // Add console logs to debug the component state
  console.log("ReviewForm state:", { 
    isEdit, 
    showSelector, 
    initialShowSelector,
    currentStep,
    selectedCoffeeId,
    initialData
  });

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {stepInfo.icon}
            {isEdit ? "Edit Review" : stepInfo.title}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update your coffee review" : stepInfo.description}
          </DialogDescription>
        </DialogHeader>
        
        {showSelector && !isEdit ? (
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
            currentStep={currentStep}
            totalSteps={2}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            showStepIndicator={!showDirectEditForm}
            isLastStep={showDirectEditForm || currentStep === FORM_STEPS.BREW_INFO}
          >
            {showDirectEditForm ? (
              <>
                {/* Edit mode - show both sections together */}
                <div className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-md font-medium mb-2">Your Review</h3>
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
                  
                  {/* Add Coffee Details section in edit mode */}
                  <div className="mb-4 border-t pt-4">
                    <h3 className="text-md font-medium mb-2">Coffee Details</h3>
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
                      showValidationErrors={false}
                      showHelpText={true}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-md font-medium mb-2">Brewing Recipe</h3>
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
                      showHelpText={true}
                    />
                    
                    {recipeCompleteness && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-100">
                        <h4 className="text-sm font-medium text-amber-800 mb-2">
                          Recipe Completeness
                        </h4>
                        <Progress value={recipeCompleteness.percentage} className="h-2 mb-2" />
                        <p className="text-xs text-amber-700">
                          You've logged {recipeCompleteness.filled} of {recipeCompleteness.total} details — complete your recipe to help others brew it too.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Add mode - show steps */}
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
                      showHelpText={true}
                    />
                    
                    <ImageUpload 
                      imageUrl={form.imageUrl}
                      setImageUrl={form.setImageUrl}
                      helpText="Uploading a bag photo helps others identify this coffee"
                    />
                    
                    {/* Review Section */}
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
                  <>
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
                      showHelpText={true}
                    />
                    
                    {recipeCompleteness && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-100">
                        <h4 className="text-sm font-medium text-amber-800 mb-2">
                          Recipe Completeness
                        </h4>
                        <Progress value={recipeCompleteness.percentage} className="h-2 mb-2" />
                        <p className="text-xs text-amber-700">
                          You've logged {recipeCompleteness.filled} of {recipeCompleteness.total} details — complete your recipe to help others brew it too.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </FormLayout>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
