
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CoffeeOrigin, RoastLevel, ProcessMethod, CoffeeType, SizeUnit } from "@/types/coffee";

interface UseCoffeeFetchProps {
  coffeeId?: string;
  reviewId?: string;
}

export const useCoffeeFetch = ({ coffeeId, reviewId }: UseCoffeeFetchProps) => {
  const { toast } = useToast();
  const [coffeeName, setCoffeeName] = useState("");
  const [roaster, setRoaster] = useState("");
  const [origin, setOrigin] = useState<CoffeeOrigin>("Ethiopia");
  const [roastLevel, setRoastLevel] = useState<RoastLevel>("Light");
  const [processMethod, setProcessMethod] = useState<ProcessMethod>("Washed");
  const [coffeeType, setCoffeeType] = useState<CoffeeType>("Single Origin");
  const [price, setPrice] = useState<number>(0);
  const [flavor, setFlavor] = useState("");
  const [size, setSize] = useState<number>(0);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>("g");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Review-specific states with empty defaults
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [brewingMethod, setBrewingMethod] = useState("");
  const [dosage, setDosage] = useState(0);
  const [water, setWater] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [brewTime, setBrewTime] = useState("");
  const [brewNotes, setBrewNotes] = useState("");

  // Automatically fetch coffee details when the component mounts and coffeeId changes
  useEffect(() => {
    if (coffeeId || reviewId) {
      console.log("Auto-fetching coffee details based on IDs:", { coffeeId, reviewId });
      fetchCoffeeDetails();
    }
  }, [coffeeId, reviewId]);

  const fetchCoffeeDetails = async () => {
    try {
      console.log("Fetching coffee details for ID:", coffeeId);
      
      if (!coffeeId && !reviewId) {
        console.log("No coffee ID or review ID provided, skipping fetch");
        return;
      }
      
      // If we have a reviewId, fetch the review first to get the coffee_id if not provided
      let actualCoffeeId = coffeeId;
      
      if (reviewId) {
        console.log("Fetching review data first with ID:", reviewId);
        const { data: reviewData, error: reviewError } = await supabase
          .from('reviews')
          .select('*, coffees(*)')
          .eq('id', reviewId)
          .single();
          
        if (reviewError) {
          console.error("Error fetching review:", reviewError);
          toast({
            title: "Error",
            description: "Could not load review details.",
            variant: "destructive"
          });
          return;
        }
        
        console.log("Review data retrieved:", reviewData);
        
        if (reviewData) {
          // Set review-specific data
          setRating(reviewData.rating || 0);
          setReviewText(reviewData.review_text || "");
          setBrewingMethod(reviewData.brewing_method || "");
          setDosage(reviewData.dosage || 0);
          setWater(reviewData.water || 0);
          setTemperature(reviewData.temperature || 0);
          setBrewTime(reviewData.brew_time || "");
          setBrewNotes(reviewData.brew_notes || "");
          
          // Get the coffee_id for the subsequent coffee fetch
          actualCoffeeId = reviewData.coffee_id;
          
          // If the review data includes coffee data, set it immediately
          if (reviewData.coffees) {
            console.log("Setting coffee data from review:", reviewData.coffees);
            setCoffeeName(reviewData.coffees.name || "");
            setOrigin(reviewData.coffees.origin as CoffeeOrigin || "Ethiopia");
            setRoastLevel(reviewData.coffees.roast_level as RoastLevel || "Medium");
            setProcessMethod(reviewData.coffees.process_method as ProcessMethod || "Washed");
            setImageUrl(reviewData.coffees.image_url);
            setPrice(reviewData.coffees.price || 0);
            setFlavor(reviewData.coffees.flavor_notes || "");
            setCoffeeType(reviewData.coffees.type as CoffeeType || "Single Origin");
          }
        }
      }
      
      // If we still have no coffee ID, we can't fetch coffee details
      if (!actualCoffeeId) {
        console.log("No coffee ID available after review fetch, skipping coffee fetch");
        return;
      }
      
      // Now fetch the coffee details to get roaster and other info
      const { data: coffeeData, error: coffeeError } = await supabase
        .from('coffees')
        .select(`
          *,
          roasters (id, name)
        `)
        .eq('id', actualCoffeeId)
        .is('deleted_at', null) // Make sure to filter out deleted coffees
        .single();
      
      if (coffeeError) {
        console.error("Error fetching coffee:", coffeeError);
        if (coffeeError.message.includes("No rows found")) {
          console.error("Coffee may have been deleted or is unavailable");
          toast({
            title: "Coffee not found",
            description: "This coffee may have been deleted or is unavailable.",
            variant: "destructive"
          });
        } else {
          throw coffeeError;
        }
        return;
      }
      
      console.log("Coffee data retrieved:", coffeeData);
      
      if (coffeeData) {
        if (coffeeData.deleted_at) {
          console.error("Coffee is marked as deleted:", coffeeData.deleted_at);
          toast({
            title: "Coffee unavailable",
            description: "This coffee is no longer available.",
            variant: "destructive"
          });
          return;
        }
        
        // Set coffee details - even if they're already set from the review data above
        // This ensures we have the most up-to-date data
        setCoffeeName(coffeeData.name || "");
        setRoaster(coffeeData.roasters?.name || "");
        setOrigin(coffeeData.origin as CoffeeOrigin || "Ethiopia");
        setRoastLevel(coffeeData.roast_level as RoastLevel || "Medium");
        setProcessMethod(coffeeData.process_method as ProcessMethod || "Washed");
        setImageUrl(coffeeData.image_url);
        setPrice(coffeeData.price || 0);
        setFlavor(coffeeData.flavor_notes || "");
        
        setCoffeeType(coffeeData.type as CoffeeType || "Single Origin");
        console.log("Setting coffee type to:", coffeeData.type);
        
        if (coffeeData.description) {
          const match = coffeeData.description.match(/(\w+) coffee, (\d+) (\w+)/);
          if (match) {
            setCoffeeType(match[1] as CoffeeType);
            setSize(parseInt(match[2]));
            setSizeUnit(match[3] as SizeUnit);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching coffee/review details:", error);
      toast({
        title: "Error",
        description: "Could not load coffee details.",
        variant: "destructive"
      });
    }
  };

  return {
    // Coffee data states
    coffeeName, setCoffeeName,
    roaster, setRoaster,
    origin, setOrigin,
    roastLevel, setRoastLevel,
    processMethod, setProcessMethod,
    coffeeType, setCoffeeType,
    price, setPrice,
    flavor, setFlavor,
    size, setSize,
    sizeUnit, setSizeUnit,
    imageUrl, setImageUrl,
    
    // Review data states
    rating, setRating,
    reviewText, setReviewText,
    brewingMethod, setBrewingMethod,
    dosage, setDosage,
    water, setWater,
    temperature, setTemperature,
    brewTime, setBrewTime,
    brewNotes, setBrewNotes,
    
    // Functions
    fetchCoffeeDetails
  };
};
