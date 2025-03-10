
import { supabase } from '@/integrations/supabase/client';

/**
 * Performs a soft delete on a coffee by setting the deleted_at timestamp
 * 
 * @param coffeeId The ID of the coffee to soft delete
 * @returns A promise that resolves to true when successful, false otherwise
 */
export const softDeleteCoffee = async (coffeeId: string): Promise<boolean> => {
  try {
    console.log(`Soft deleting coffee with ID: ${coffeeId}`);
    
    // Check if the coffee exists first
    const { data: coffee, error: checkError } = await supabase
      .from('coffees')
      .select('id')
      .eq('id', coffeeId)
      .is('deleted_at', null)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking coffee existence:", checkError);
      return false;
    }
    
    if (!coffee) {
      console.error("Coffee not found or already deleted:", coffeeId);
      return false;
    }
    
    // Soft delete the coffee by setting deleted_at
    const { error, data } = await supabase
      .from('coffees')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', coffeeId)
      .select();

    if (error) {
      console.error("Error soft deleting coffee:", error);
      return false;
    }
    
    console.log(`Successfully soft deleted coffee with ID: ${coffeeId}`, data);
    return true;
  } catch (error) {
    console.error("Exception in softDeleteCoffee:", error);
    return false;
  }
};

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
    
    // Then delete the coffee itself - this is a HARD delete
    const { error, count } = await supabase
      .from('coffees')
      .delete()
      .eq('id', coffeeId)
      .select('count');

    if (error) {
      console.error("Error hard deleting coffee:", error);
      return false;
    }
    
    console.log(`Successfully hard deleted coffee with ID: ${coffeeId}, count: ${count}`);
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
