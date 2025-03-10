
import { supabase } from '@/integrations/supabase/client';

/**
 * Permanently deletes a coffee from the database
 * 
 * @param coffeeId The ID of the coffee to delete
 * @returns A promise that resolves to true when successful, false otherwise
 */
export const hardDeleteCoffee = async (coffeeId: string): Promise<boolean> => {
  try {
    console.log(`Hard deleting coffee with ID: ${coffeeId}`);
    
    // Check if the coffee exists first
    const { data: coffee, error: checkError } = await supabase
      .from('coffees')
      .select('id')
      .eq('id', coffeeId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking coffee existence:", checkError);
      return false;
    }
    
    if (!coffee) {
      console.error("Coffee not found:", coffeeId);
      return false;
    }
    
    // First, delete associated reviews
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .eq('coffee_id', coffeeId);
      
    if (reviewsError) {
      console.error("Error deleting associated reviews:", reviewsError);
      return false;
    }
    
    // Then delete the coffee itself
    const { error } = await supabase
      .from('coffees')
      .delete()
      .eq('id', coffeeId);

    if (error) {
      console.error("Error hard deleting coffee:", error);
      return false;
    }
    
    console.log(`Successfully hard deleted coffee with ID: ${coffeeId}`);
    return true;
  } catch (error) {
    console.error("Exception in hardDeleteCoffee:", error);
    return false;
  }
};

/**
 * Checks if the current user can delete a coffee
 * 
 * @param coffeeCreatedBy The user ID of the coffee creator
 * @param currentUserId The current user's ID
 * @returns true if the user can delete the coffee
 */
export const canDeleteCoffee = (coffeeCreatedBy: string, currentUserId?: string): boolean => {
  if (!currentUserId) return false;
  const canDelete = coffeeCreatedBy === currentUserId;
  console.log(`Can delete check: coffee created by ${coffeeCreatedBy}, current user ${currentUserId}, result: ${canDelete}`);
  return canDelete;
};
