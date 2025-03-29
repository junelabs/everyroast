import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CoffeeOrigin, RoastLevel, ProcessMethod, CoffeeType, SizeUnit } from "@/types/coffee";

interface UseFormSubmitProps {
  coffeeId?: string;
  reviewId?: string;
  isEdit?: boolean;
  onClose: () => void;
  
  // States and values passed from parent hook
  rating: number;
  reviewText: string;
  brewingMethod: string;
  dosage: number;
  water: number;
  temperature: number;
  brewTime: string;
  brewNotes: string;
  imageUrl: string | null;
  coffeeName: string;
  roaster: string;
  origin: CoffeeOrigin;
  roastLevel: RoastLevel;
  processMethod: ProcessMethod;
  coffeeType: CoffeeType;
  price: number;
  flavor: string;
  size: number;
  sizeUnit: SizeUnit;
  
  // Reset function
  resetForm: () => void;
}

export const useFormSubmit = ({
  coffeeId,
  reviewId,
  isEdit = false,
  onClose,
  rating,
  reviewText,
  brewingMethod,
  dosage,
  water,
  temperature,
  brewTime,
  brewNotes,
  imageUrl,
  coffeeName,
  roaster,
  origin,
  roastLevel,
  processMethod,
  coffeeType,
  price,
  flavor,
  size,
  sizeUnit,
  resetForm
}: UseFormSubmitProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review.",
        variant: "destructive"
      });
      return false;
    }
    
    // We'll handle the rating validation in the ReviewForm component
    // so we don't show a toast here anymore
    
    if (!isEdit && !coffeeName) {
      toast({
        title: "Coffee name required",
        description: "Please enter a name for the coffee.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!isEdit && !roaster) {
      toast({
        title: "Roaster required",
        description: "Please enter a roaster name.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      let coffeeRecord;
      
      if (coffeeId && isEdit) {
        const { data, error } = await supabase
          .from('coffees')
          .select('*')
          .eq('id', coffeeId)
          .single();
        
        if (error) throw error;
        coffeeRecord = data;
        
        console.log("Updating existing coffee:", coffeeRecord);
        
        const { error: updateError } = await supabase
          .from('coffees')
          .update({
            origin: origin,
            roast_level: roastLevel,
            process_method: processMethod,
            price: price,
            flavor_notes: flavor,
            type: coffeeType,
            updated_at: new Date().toISOString()
          })
          .eq('id', coffeeId);
            
        if (updateError) throw updateError;
      } else if (!isEdit) {
        const { data: roasterData, error: roasterError } = await supabase
          .from('roasters')
          .select('id')
          .eq('name', roaster)
          .maybeSingle();
        
        let roasterId;
        
        if (!roasterData) {
          console.log("Roaster not found, creating new user-submitted roaster:", roaster);
          
          // Create a temporary roaster entry that is completely isolated from the Roasters page
          const { data: newRoaster, error: newRoasterError } = await supabase
            .from('roasters')
            .insert({
              name: roaster,
              created_by: user.id, // Mark as user-created
              location: null, // Explicitly set to null 
              website: null, // Additional null fields to ensure it's recognized as user-created
              description: null, // Additional null field to ensure it's recognized as user-created
              instagram: null // Additional null field to ensure it's recognized as user-created
            })
            .select('id')
            .single();
          
          if (newRoasterError) throw newRoasterError;
          roasterId = newRoaster.id;
          console.log("Created new user-submitted roaster with ID:", roasterId);
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
          description: `${coffeeType} coffee, ${size} ${sizeUnit}`,
          type: coffeeType
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
        const { data, error } = await supabase
          .from('coffees')
          .select('*')
          .eq('id', coffeeId)
          .single();
        
        if (error) throw error;
        coffeeRecord = data;
      }
      
      const reviewData = {
        coffee_id: coffeeRecord.id,
        user_id: user.id,
        rating,
        review_text: reviewText,
        brewing_method: brewingMethod || null,
        dosage: dosage || null,
        water: water || null,
        temperature: temperature || null,
        brew_time: brewTime || null,
        brew_notes: brewNotes || null
      };

      console.log("Review data being saved:", reviewData);

      if (reviewId) {
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

  return {
    isSubmitting,
    handleSubmit
  };
};
