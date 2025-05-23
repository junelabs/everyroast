
import { useState, useEffect } from "react";
import { CoffeeOrigin, RoastLevel, ProcessMethod, CoffeeType, SizeUnit } from "@/types/coffee";
import { useCoffeeFetch } from "./useCoffeeFetch";
import { useFormSubmit } from "./useFormSubmit";
import { origins, roastLevels, processMethods, coffeeTypes, sizeUnits } from "./formConstants";

interface UseReviewFormProps {
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
  onClose: () => void;
}

export const useReviewForm = ({
  coffeeId,
  reviewId,
  initialData,
  isEdit = false,
  onClose
}: UseReviewFormProps) => {
  // Use the coffee fetch hook for all data retrieval
  const coffeeData = useCoffeeFetch({ coffeeId, reviewId });
  
  // Initialize form state with initialData or defaults
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [reviewText, setReviewText] = useState(initialData?.reviewText || "");
  const [brewingMethod, setBrewingMethod] = useState(initialData?.brewingMethod || "");
  const [dosage, setDosage] = useState(initialData?.dosage || 0);
  const [water, setWater] = useState(initialData?.water || 0);
  const [temperature, setTemperature] = useState(initialData?.temperature || 0);
  const [brewTime, setBrewTime] = useState(initialData?.brewTime || "");
  const [brewNotes, setBrewNotes] = useState(initialData?.brewNotes || "");
  
  // Update local state when initialData changes
  useEffect(() => {
    console.log("Initial data changed:", initialData);
    if (initialData) {
      setRating(initialData.rating || 0);
      setReviewText(initialData.reviewText || "");
      setBrewingMethod(initialData.brewingMethod || "");
      setDosage(initialData.dosage || 0);
      setWater(initialData.water || 0);
      setTemperature(initialData.temperature || 0);
      setBrewTime(initialData.brewTime || "");
      setBrewNotes(initialData.brewNotes || "");
    }
  }, [initialData]);

  // Update local state when coffeeData changes during edit
  useEffect(() => {
    if (isEdit) {
      console.log("Coffee data from fetch updated, updating form values");
      // First check if we have review-specific data and set it
      if (coffeeData.rating > 0) {
        setRating(coffeeData.rating);
        setReviewText(coffeeData.reviewText || "");
        setBrewingMethod(coffeeData.brewingMethod || "");
        setDosage(coffeeData.dosage || 0);
        setWater(coffeeData.water || 0);
        setTemperature(coffeeData.temperature || 0);
        setBrewTime(coffeeData.brewTime || "");
        setBrewNotes(coffeeData.brewNotes || "");
      }
      
      // Log coffee data for debugging
      console.log("Coffee data for form:", {
        name: coffeeData.coffeeName,
        roaster: coffeeData.roaster,
        origin: coffeeData.origin,
        roastLevel: coffeeData.roastLevel,
        // etc.
      });
    }
  }, [isEdit, coffeeData.rating, coffeeData.reviewText, coffeeData.brewingMethod, 
      coffeeData.dosage, coffeeData.water, coffeeData.temperature, coffeeData.brewTime,
      coffeeData.brewNotes, coffeeData.coffeeName, coffeeData.roaster, coffeeData.origin]);

  const resetForm = () => {
    if (!isEdit) {
      setRating(0);
      setReviewText("");
      setBrewingMethod("");
      setDosage(0);
      setWater(0);
      setTemperature(0);
      setBrewTime("");
      setBrewNotes("");
      coffeeData.setCoffeeName("");
      coffeeData.setRoaster("");
      coffeeData.setOrigin("Ethiopia");
      coffeeData.setRoastLevel("Medium");
      coffeeData.setProcessMethod("Washed");
      coffeeData.setCoffeeType("Single Origin");
      coffeeData.setPrice(0);
      coffeeData.setFlavor("");
      coffeeData.setSize(0);
      coffeeData.setSizeUnit("g");
      coffeeData.setImageUrl(null);
    }
  };

  // Use the form submit hook for submission handling
  const formSubmit = useFormSubmit({
    coffeeId,
    reviewId,
    isEdit,
    onClose,
    rating,
    reviewText,
    brewingMethod,
    dosage,
    water,
    temperature,
    brewTime,
    brewNotes,
    imageUrl: coffeeData.imageUrl,
    coffeeName: coffeeData.coffeeName || "",
    roaster: coffeeData.roaster || "",
    origin: coffeeData.origin || "Ethiopia",
    roastLevel: coffeeData.roastLevel || "Medium",
    processMethod: coffeeData.processMethod || "Washed",
    coffeeType: coffeeData.coffeeType || "Single Origin",
    price: coffeeData.price || 0,
    flavor: coffeeData.flavor || "",
    size: coffeeData.size || 0,
    sizeUnit: coffeeData.sizeUnit || "g",
    resetForm
  });

  return {
    // Review specific states
    rating, setRating,
    reviewText, setReviewText,
    brewingMethod, setBrewingMethod,
    
    // Brewing recipe states
    dosage, setDosage,
    water, setWater,
    temperature, setTemperature,
    brewTime, setBrewTime,
    brewNotes, setBrewNotes,
    
    // Form submission states and handlers
    isSubmitting: formSubmit.isSubmitting,
    handleSubmit: formSubmit.handleSubmit,
    
    // Coffee data states from useCoffeeFetch
    imageUrl: coffeeData.imageUrl, setImageUrl: coffeeData.setImageUrl,
    coffeeName: coffeeData.coffeeName || "", setCoffeeName: coffeeData.setCoffeeName,
    roaster: coffeeData.roaster || "", setRoaster: coffeeData.setRoaster,
    origin: coffeeData.origin || "Ethiopia", setOrigin: coffeeData.setOrigin,
    roastLevel: coffeeData.roastLevel || "Medium", setRoastLevel: coffeeData.setRoastLevel,
    processMethod: coffeeData.processMethod || "Washed", setProcessMethod: coffeeData.setProcessMethod,
    coffeeType: coffeeData.coffeeType || "Single Origin", setCoffeeType: coffeeData.setCoffeeType,
    price: coffeeData.price || 0, setPrice: coffeeData.setPrice,
    flavor: coffeeData.flavor || "", setFlavor: coffeeData.setFlavor,
    size: coffeeData.size || 0, setSize: coffeeData.setSize,
    sizeUnit: coffeeData.sizeUnit || "g", setSizeUnit: coffeeData.setSizeUnit,
    
    // Constants for form options - ensure these are always arrays
    origins: origins || [],
    roastLevels: roastLevels || [],
    processMethods: processMethods || [],
    coffeeTypes: coffeeTypes || [],
    sizeUnits: sizeUnits || [],
    
    // Utility functions
    resetForm
  };
};
