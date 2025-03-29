
import { Coffee, CupSoda } from "lucide-react";

// Define steps for the multi-step form as constants
export const FORM_STEPS = {
  COFFEE_INFO: 0,
  BREW_INFO: 1
};

interface StepInfo {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface StepManagerProps {
  currentStep: number;
  isEdit: boolean;
}

export const getStepInfo = ({ currentStep, isEdit }: StepManagerProps): StepInfo => {
  switch (currentStep) {
    case FORM_STEPS.COFFEE_INFO:
      return {
        icon: <Coffee className="h-5 w-5 text-roast-500" />,
        title: isEdit ? "Edit Coffee Details" : "Coffee Details",
        description: "Enter coffee details and your review"
      };
    case FORM_STEPS.BREW_INFO:
      return {
        icon: <CupSoda className="h-5 w-5 text-roast-500" />,
        title: "Brewing Recipe",
        description: "Enter your brewing method and recipe details"
      };
    default:
      return {
        icon: <Coffee className="h-5 w-5 text-roast-500" />,
        title: "Coffee Log",
        description: "Log your coffee experience"
      };
  }
};

export default FORM_STEPS;
