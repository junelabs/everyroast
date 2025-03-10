
import { supabase } from "@/integrations/supabase/client";
import { Roaster } from "@/components/roasters/RoasterCard";

export const fetchRoasters = async (): Promise<Roaster[]> => {
  try {
    // Get all roasters
    const { data: roasters, error } = await supabase
      .from('roasters')
      .select('*')
      .order('name');

    if (error) throw error;

    // Get coffee count for each roaster
    const roastersWithCoffeeCount = await Promise.all(
      roasters.map(async (roaster) => {
        const { count, error: countError } = await supabase
          .from('coffees')
          .select('*', { count: 'exact', head: true })
          .eq('roaster_id', roaster.id);

        if (countError) {
          console.error('Error getting coffee count:', countError);
          return { ...roaster, coffeeCount: 0 };
        }

        return { ...roaster, coffeeCount: count || 0 };
      })
    );

    return roastersWithCoffeeCount;
  } catch (error) {
    console.error('Error fetching roasters:', error);
    throw error;
  }
};

export const fetchRoasterById = async (id: string): Promise<Roaster | null> => {
  try {
    const { data, error } = await supabase
      .from('roasters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Get coffee count for the roaster
    const { count, error: countError } = await supabase
      .from('coffees')
      .select('*', { count: 'exact', head: true })
      .eq('roaster_id', id);

    if (countError) {
      console.error('Error getting coffee count:', countError);
      return { ...data, coffeeCount: 0 };
    }

    return { ...data, coffeeCount: count || 0 };
  } catch (error) {
    console.error('Error fetching roaster:', error);
    throw error;
  }
};
