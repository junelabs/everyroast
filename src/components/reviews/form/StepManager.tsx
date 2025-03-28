
import { Coffee, CupSoda, Info, List } from "lucide-react";

// Define steps for the multi-step form as constants
export const FORM_STEPS = {
  SELECT_COFFEE: 0,
  COFFEE_INFO: 1,
  BREW_INFO: 2,
  REVIEW_INFO: 3
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
    case FORM_STEPS.SELECT_COFFEE:
      return {
        icon: <List className="h-5 w-5 text-roast-500" />,
        title: "Select Coffee",
        description: "Select a recent coffee or add a new one"
      };
    case FORM_STEPS.COFFEE_INFO:
      return {
        icon: <Coffee className="h-5 w-5 text-roast-500" />,
        title: isEdit ? "Edit Coffee Details" : "Coffee Details",
        description: "Enter coffee origin, type, and flavor notes"
      };
    case FORM_STEPS.BREW_INFO:
      return {
        icon: <CupSoda className="h-5 w-5 text-roast-500" />,
        title: "Brewing Recipe",
        description: "How did you brew this coffee? Method, dose, water, temp, time"
      };
    case FORM_STEPS.REVIEW_INFO:
      return {
        icon: <Info className="h-5 w-5 text-roast-500" />,
        title: "Your Review",
        description: "Rate and share your thoughts about this coffee"
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
