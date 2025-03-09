
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CoffeeOrigin, RoastLevel, ProcessMethod, CoffeeType, SizeUnit } from "@/types/coffee";

interface UseReviewFormProps {
  coffeeId?: string;
  reviewId?: string;
  initialData?: {
    rating: number;
    reviewText: string;
    brewingMethod: string;
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
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [reviewText, setReviewText] = useState(initialData?.reviewText || "");
  const [brewingMethod, setBrewingMethod] = useState(initialData?.brewingMethod || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [coffeeName, setCoffeeName] = useState("");
  const [roaster, setRoaster] = useState("");
  const [origin, setOrigin] = useState<CoffeeOrigin>("Ethiopia");
  const [roastLevel, setRoastLevel] = useState<RoastLevel>("Medium");
  const [processMethod, setProcessMethod] = useState<ProcessMethod>("Washed");
  const [coffeeType, setCoffeeType] = useState<CoffeeType>("Single Origin");
  const [price, setPrice] = useState<number>(0);
  const [flavor, setFlavor] = useState("");
  const [size, setSize] = useState<number>(0);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>("g");

  const origins: CoffeeOrigin[] = [
    'Ethiopia', 'Colombia', 'Brazil', 'Guatemala', 'Costa Rica', 'Kenya',
    'Peru', 'Indonesia', 'Vietnam', 'Honduras', 'Mexico', 'Rwanda',
    'Tanzania', 'Uganda', 'India', 'Panama', 'Jamaica', 'Haiti',
    'El Salvador', 'Yemen'
  ];
  const roastLevels: RoastLevel[] = ['Light', 'Medium', 'Medium-Dark', 'Dark'];
  const processMethods: ProcessMethod[] = ['Washed', 'Natural', 'Honey', 'Anaerobic'];
  const coffeeTypes: CoffeeType[] = ['Single Origin', 'Blend', 'Espresso'];
  const sizeUnits: SizeUnit[] = ['g', 'oz'];

  // Effect to fetch coffee details when editing a review
  useEffect(() => {
    if (isEdit && coffeeId) {
      fetchCoffeeDetails();
    } else if (!isEdit) {
      // Reset form for new reviews
      resetForm();
    }
  }, [coffeeId, isEdit]);

  const fetchCoffeeDetails = async () => {
    try {
      console.log("Fetching coffee details for ID:", coffeeId);
      
      // First fetch the coffee details
      const { data: coffeeData, error: coffeeError } = await supabase
        .from('coffees')
        .select(`
          *,
          roasters(name)
        `)
        .eq('id', coffeeId)
        .single();
      
      if (coffeeError) throw coffeeError;
      
      // Log what we got back
      console.log("Coffee data retrieved:", coffeeData);
      
      if (coffeeData) {
        setCoffeeName(coffeeData.name || "");
        setRoaster(coffeeData.roasters?.name || "");
        setOrigin(coffeeData.origin as CoffeeOrigin || "Ethiopia");
        setRoastLevel(coffeeData.roast_level as RoastLevel || "Medium");
        setProcessMethod(coffeeData.process_method as ProcessMethod || "Washed");
        setImageUrl(coffeeData.image_url);
        setPrice(coffeeData.price || 0);
        setFlavor(coffeeData.flavor_notes || "");
        
        // Parse size and type from description
        if (coffeeData.description) {
          const match = coffeeData.description.match(/(\w+) coffee, (\d+) (\w+)/);
          if (match) {
            setCoffeeType(match[1] as CoffeeType);
            setSize(parseInt(match[2]));
            setSizeUnit(match[3] as SizeUnit);
          }
        }
      }
      
      // If we have a reviewId, fetch the review details also
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review.",
        variant: "destructive"
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isEdit && !coffeeName) {
      toast({
        title: "Coffee name required",
        description: "Please enter a name for the coffee.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isEdit && !roaster) {
      toast({
        title: "Roaster required",
        description: "Please enter a roaster name.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let coffeeRecord;
      
      if (coffeeId && isEdit) {
        // Update existing coffee record if we're editing
        const { data, error } = await supabase
          .from('coffees')
          .select('*')
          .eq('id', coffeeId)
          .single();
        
        if (error) throw error;
        coffeeRecord = data;
        
        console.log("Updating existing coffee:", coffeeRecord);
        
        // Update coffee details if we're editing
        const { error: updateError } = await supabase
          .from('coffees')
          .update({
            origin: origin,
            roast_level: roastLevel,
            process_method: processMethod,
            price: price,
            flavor_notes: flavor,
            updated_at: new Date().toISOString()
          })
          .eq('id', coffeeId);
            
        if (updateError) throw updateError;
      } else if (!isEdit) {
        // Create a new coffee record
        console.log("Creating new coffee with roaster:", roaster);
        
        const { data: roasterData, error: roasterError } = await supabase
          .from('roasters')
          .select('id')
          .eq('name', roaster)
          .maybeSingle();
        
        let roasterId;
        
        if (!roasterData) {
          console.log("Roaster not found, creating new roaster:", roaster);
          const { data: newRoaster, error: newRoasterError } = await supabase
            .from('roasters')
            .insert({
              name: roaster,
              created_by: user.id
            })
            .select('id')
            .single();
          
          if (newRoasterError) throw newRoasterError;
          roasterId = newRoaster.id;
          console.log("Created new roaster with ID:", roasterId);
        } else {
          roasterId = roasterData.id;
          console.log("Found existing roaster with ID:", roasterId);
        }
        
        const coffeeData = {
          name: coffeeName,
          roaster_id: roasterId,
          origin: origin,
          roast_level: roastLevel,
          process_method: processMethod,
          price: price,
          flavor_notes: flavor,
          created_by: user.id,
          image_url: imageUrl || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          description: `${coffeeType} coffee, ${size} ${sizeUnit}`
        };
        
        console.log("Creating new coffee with data:", coffeeData);
        
        const { data: newCoffee, error: newCoffeeError } = await supabase
          .from('coffees')
          .insert(coffeeData)
          .select('id')
          .single();
        
        if (newCoffeeError) throw newCoffeeError;
        coffeeRecord = newCoffee;
        console.log("Created new coffee with ID:", coffeeRecord.id);
      } else {
        // Just get the existing coffee record for the review
        const { data, error } = await supabase
          .from('coffees')
          .select('*')
          .eq('id', coffeeId)
          .single();
        
        if (error) throw error;
        coffeeRecord = data;
      }
      
      // Now handle the review data
      const reviewData = {
        coffee_id: coffeeRecord.id,
        user_id: user.id,
        rating,
        review_text: reviewText,
        brewing_method: brewingMethod || null
      };

      console.log("Review data being saved:", reviewData);

      if (reviewId) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', reviewId);
          
        if (error) throw error;
        
        toast({
          title: "Review updated",
          description: "Your review has been successfully updated!",
        });
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert(reviewData);
          
        if (error) throw error;
        
        toast({
          title: "Review submitted",
          description: "Thank you for sharing your experience!",
        });
      }
      
      resetForm();
      onClose();
      // Refresh the profile page to show the new review
      navigate("/profile");
      
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setReviewText("");
    setBrewingMethod("");
    setCoffeeName("");
    setRoaster("");
    setOrigin("Ethiopia");
    setRoastLevel("Medium");
    setProcessMethod("Washed");
    setCoffeeType("Single Origin");
    setPrice(0);
    setFlavor("");
    setSize(0);
    setSizeUnit("g");
    setImageUrl(null);
  };

  return {
    rating, setRating,
    reviewText, setReviewText,
    brewingMethod, setBrewingMethod,
    isSubmitting,
    imageUrl, setImageUrl,
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
    origins,
    roastLevels,
    processMethods,
    coffeeTypes,
    sizeUnits,
    handleSubmit,
    resetForm
  };
};
