
import { supabase } from '@/integrations/supabase/client';

/**
 * Soft deletes a coffee by setting its deleted_at timestamp
 * 
 * @param coffeeId The ID of the coffee to delete
 * @returns A promise that resolves to true when successful, false otherwise
 */
export const softDeleteCoffee = async (coffeeId: string): Promise<boolean> => {
  try {
    console.log(`Soft deleting coffee with ID: ${coffeeId}`);
    
    const { error } = await supabase
      .from('coffees')
      .update({ 
        deleted_at: new Date().toISOString()
      })
      .eq('id', coffeeId);

    if (error) {
      console.error("Error soft deleting coffee:", error);
      return false;
    }
    
    console.log(`Successfully soft deleted coffee with ID: ${coffeeId}`);
    return true;
  } catch (error) {
    console.error("Exception in softDeleteCoffee:", error);
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
  return coffeeCreatedBy === currentUserId;
};

/**
 * Hard deletes a coffee (completely removes it from the database)
 * This is generally not recommended - use softDeleteCoffee instead
 * 
 * @param coffeeId The ID of the coffee to permanently delete
 * @returns A promise that resolves to true when successful, false otherwise
 */
export const hardDeleteCoffee = async (coffeeId: string): Promise<boolean> => {
  try {
    console.log(`Hard deleting coffee with ID: ${coffeeId}`);
    
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
