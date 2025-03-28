
import { useEffect, useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Coffee, CupSoda, Info, List, PlusCircle } from "lucide-react";
import { useReviewForm } from "./hooks/useReviewForm";
import FormLayout from "./form/FormLayout";
import CoffeeDetailsSection from "./form/CoffeeDetailsSection";
import ReviewSection from "./form/ReviewSection";
import ImageUpload from "./form/ImageUpload";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";
import { Card } from "@/components/ui/card";

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
  SELECT_COFFEE: 0,
  COFFEE_INFO: 1,
  BREW_INFO: 2,
  REVIEW_INFO: 3
};

const ReviewForm = ({ 
  isOpen, 
  onClose, 
  coffeeId, 
  reviewId, 
  initialData, 
  isEdit = false 
}: ReviewFormProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(isEdit ? FORM_STEPS.COFFEE_INFO : FORM_STEPS.SELECT_COFFEE);
  const [selectedCoffeeId, setSelectedCoffeeId] = useState<string | undefined>(coffeeId);
  
  const form = useReviewForm({
    coffeeId: selectedCoffeeId,
    reviewId,
    initialData,
    isEdit,
    onClose
  });

  // Fetch recent coffees
  const { data: recentCoffees = [], isLoading: isLoadingRecentCoffees } = useQuery({
    queryKey: ['recentCoffees', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('coffees')
        .select(`
          id,
          name, 
          image_url,
          roasters (name)
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && currentStep === FORM_STEPS.SELECT_COFFEE
  });

  // Reset form and step when dialog opens/closes or isEdit changes
  useEffect(() => {
    if (!isOpen) {
      // Give the dialog time to animate closed before resetting form
      setTimeout(() => {
        form.resetForm();
        setCurrentStep(isEdit ? FORM_STEPS.COFFEE_INFO : FORM_STEPS.SELECT_COFFEE);
        setSelectedCoffeeId(coffeeId);
      }, 200);
    }
  }, [isOpen]);

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.REVIEW_INFO));
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

  const getStepIcon = () => {
    switch (currentStep) {
      case FORM_STEPS.SELECT_COFFEE:
        return <List className="h-5 w-5 text-roast-500" />;
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
      case FORM_STEPS.SELECT_COFFEE:
        return "Select Coffee";
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
      case FORM_STEPS.SELECT_COFFEE:
        return "Select a recent coffee or add a new one";
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
        
        {currentStep === FORM_STEPS.SELECT_COFFEE ? (
          <div className="space-y-6 pt-4">
            <h3 className="font-medium text-xl">Recent Coffees</h3>
            
            <div className="space-y-0 rounded-lg border overflow-hidden">
              {isLoadingRecentCoffees ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-20 animate-pulse bg-gray-100 border-b last:border-b-0"></div>
                ))
              ) : recentCoffees.length > 0 ? (
                recentCoffees.map((coffee: any, index: number) => (
                  <div 
                    key={coffee.id}
                    className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer`}
                    onClick={() => handleSelectCoffee(coffee.id)}
                  >
                    <div className="flex items-center p-4">
                      <div className="h-14 w-14 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                        {coffee.image_url ? (
                          <img 
                            src={coffee.image_url} 
                            alt={coffee.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Coffee className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">{coffee.name}</h4>
                        <p className="text-sm text-gray-500">{coffee.roasters?.name || 'Unknown Roaster'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No recent coffees found
                </div>
              )}
            </div>
            
            <Button
              onClick={handleAddNewCoffee}
              className="w-full bg-roast-500 hover:bg-roast-600 flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add New Coffee
            </Button>
            
            <div className="flex justify-end pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <FormLayout 
            isSubmitting={form.isSubmitting}
            onClose={onClose}
            isEdit={isEdit}
            onSubmit={form.handleSubmit}
            currentStep={currentStep - 1} // Adjust since we're skipping the first step in the step indicator
            totalSteps={3}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            showStepIndicator={currentStep > FORM_STEPS.SELECT_COFFEE}
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
