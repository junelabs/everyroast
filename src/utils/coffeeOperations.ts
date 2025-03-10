
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

/**
 * Soft deletes a coffee by setting its deleted_at timestamp
 * 
 * @param coffeeId The ID of the coffee to delete
 * @returns A promise that resolves when the operation is complete
 */
export const softDeleteCoffee = async (coffeeId: string): Promise<boolean> => {
  try {
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
