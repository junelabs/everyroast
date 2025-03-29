
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface FormLayoutProps {
  children: React.ReactNode;
  isSubmitting: boolean;
  onClose: () => void;
  isEdit: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  currentStep?: number;
  totalSteps?: number;
  onNextStep?: () => void;
  onPrevStep?: () => void;
  showStepIndicator?: boolean;
  isLastStep?: boolean;
}

const FormLayout = ({
  children,
  isSubmitting,
  onClose,
  isEdit,
  onSubmit,
  currentStep = 0,
  totalSteps = 1,
  onNextStep,
  onPrevStep,
  showStepIndicator = true,
  isLastStep = false
}: FormLayoutProps) => {
  const isFirstStep = currentStep === 0;
  
  return (
    <form onSubmit={onSubmit} className="space-y-6 pt-4">
      {/* Step indicator */}
      {showStepIndicator && totalSteps > 1 && (
        <div className="flex items-center justify-between mb-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index} 
              className={`
                h-2 flex-1 rounded-full mx-1
                ${index <= currentStep ? 'bg-roast-500' : 'bg-gray-200'}
              `}
            />
          ))}
        </div>
      )}
      
      {children}

      <div className="flex justify-between pt-4 border-t">
        {totalSteps > 1 ? (
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={isFirstStep ? onClose : onPrevStep}
            >
              {isFirstStep ? (
                "Cancel"
              ) : (
                <>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </>
              )}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-roast-500 hover:bg-roast-600"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full" />
                  Saving...
                </div>
              ) : isLastStep ? (
                <>
                  {isEdit ? "Update" : "Submit"}
                  <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-roast-500 hover:bg-roast-600"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full" />
                  Saving...
                </div>
              ) : (
                <>
                  {isEdit ? "Update" : "Submit"}
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default FormLayout;
