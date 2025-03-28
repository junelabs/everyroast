
import { useState } from "react";
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

  const fetchCoffeeDetails = async () => {
    try {
      console.log("Fetching coffee details for ID:", coffeeId);
      
      if (!coffeeId) {
        console.log("No coffee ID provided, skipping fetch");
        return;
      }
      
      const { data: coffeeData, error: coffeeError } = await supabase
        .from('coffees')
        .select(`
          *,
          roasters (name)
        `)
        .eq('id', coffeeId)
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
      
      if (reviewId) {
        const { data: reviewData, error: reviewError } = await supabase
          .from('reviews')
          .select('*')
          .eq('id', reviewId)
          .single();
          
        if (reviewError) throw reviewError;
        
        console.log("Review data retrieved:", reviewData);
        
        if (reviewData) {
          setRating(reviewData.rating || 0);
          setReviewText(reviewData.review_text || "");
          setBrewingMethod(reviewData.brewing_method || "");
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
    
    // Functions
    fetchCoffeeDetails
  };
};
