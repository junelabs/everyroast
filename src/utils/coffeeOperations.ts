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
    
    // Check if the coffee exists
    const { data: coffee, error: checkError } = await supabase
      .from('coffees')
      .select('id, deleted_at')
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
    
    if (coffee.deleted_at) {
      console.log(`Coffee ${coffeeId} is already deleted`);
      return true; // Already deleted
    }
    
    console.log("Found coffee to delete:", coffee);
    
    const deleteTimestamp = new Date().toISOString();
    
    const { error } = await supabase
      .from('coffees')
      .update({ 
        deleted_at: deleteTimestamp
      })
      .eq('id', coffeeId);

    if (error) {
      console.error("Error soft deleting coffee:", error);
      return false;
    }
    
    console.log(`Successfully soft deleted coffee with ID: ${coffeeId} at ${deleteTimestamp}`);
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
  const canDelete = coffeeCreatedBy === currentUserId;
  console.log(`Can delete check: coffee created by ${coffeeCreatedBy}, current user ${currentUserId}, result: ${canDelete}`);
  return canDelete;
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
