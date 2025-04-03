
import { supabase } from "@/integrations/supabase/client";
import { Roaster } from "@/components/roasters/RoasterCard";
import { roasterData } from "@/data/mockRoasterData";
import { Coffee } from "@/types/coffee";

// Fetch all roasters from Supabase with optimized query
export const fetchRoasters = async (): Promise<Roaster[]> => {
  try {
    console.log("Fetching roasters from Supabase");
    
    // Query for official roasters (not user-created ones)
    const { data, error } = await supabase
      .from('roasters')
      .select('id, name, location, description, website, instagram, logo_url')
      .is('created_by', null) // Only get official roasters (no user-created ones)
      .order('name', { ascending: true })
      .limit(100); // Limit to 100 roasters for initial load
    
    if (error) {
      console.error('Error fetching roasters:', error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} roasters`);
    
    // Transform the data to match the Roaster interface and get real coffee counts
    const roastersWithCounts = await Promise.all((data || []).map(async (item) => {
      // Get actual coffee count for each roaster
      const { count, error: countError } = await supabase
        .from('coffees')
        .select('id', { count: 'exact', head: true })
        .eq('roaster_id', item.id)
        .is('deleted_at', null);
      
      if (countError) {
        console.error(`Error fetching coffee count for roaster ${item.id}:`, countError);
      }
      
      return {
        id: item.id,
        name: item.name,
        location: item.location,
        description: item.description,
        website: item.website,
        instagram: item.instagram,
        logo_url: item.logo_url,
        coffeeCount: count || 0 // Use actual count instead of random number
      };
    }));
    
    return roastersWithCounts;
  } catch (error) {
    console.error('Error in fetchRoasters:', error);
    // Fall back to mock data if there's an error
    return roasterData.slice(0, 50).map(roaster => ({
      ...roaster,
      coffeeCount: 0 // Default count for mock data
    }));
  }
};

// Optimized to fetch only necessary fields for a single roaster
export const fetchRoasterById = async (id: string): Promise<Roaster | null> => {
  try {
    console.log(`Fetching roaster with ID: ${id}`);
    
    const { data, error } = await supabase
      .from('roasters')
      .select('id, name, location, description, website, instagram, logo_url')
      .eq('id', id)
      .is('created_by', null) // Only get official roasters (no user-created ones)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors if not found
    
    if (error) {
      console.error('Error fetching roaster by ID:', error);
      throw error;
    }
    
    if (!data) {
      console.log(`No roaster found with ID: ${id}`);
      return null;
    }
    
    console.log(`Successfully fetched roaster: ${data.name}`);
    
    // Get actual coffee count for this roaster
    const { count, error: countError } = await supabase
      .from('coffees')
      .select('id', { count: 'exact', head: true })
      .eq('roaster_id', id)
      .is('deleted_at', null);
    
    if (countError) {
      console.error(`Error fetching coffee count for roaster ${id}:`, countError);
    }
    
    // Transform the data to match the Roaster interface
    const roaster: Roaster = {
      id: data.id,
      name: data.name,
      location: data.location,
      description: data.description,
      website: data.website,
      instagram: data.instagram,
      logo_url: data.logo_url,
      coffeeCount: count || 0 // Use actual count instead of random number
    };
    
    return roaster;
  } catch (error) {
    console.error('Error in fetchRoasterById:', error);
    // Fall back to mock data if there's an error
    const roaster = roasterData.find(r => r.id === id);
    return roaster ? { ...roaster, coffeeCount: 0 } : null;
  }
};

// Updated function to fetch coffees for a specific roaster - now filtered for official entries
export const fetchRoasterCoffees = async (roasterId: string): Promise<Coffee[]> => {
  try {
    console.log(`Fetching official coffees for roaster ID: ${roasterId}`);
    
    const { data, error } = await supabase
      .from('coffees')
      .select(`
        id,
        name,
        origin,
        price,
        roast_level,
        process_method,
        flavor_notes,
        type,
        image_url
      `)
      .eq('roaster_id', roasterId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching coffees by roaster ID:', error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} official coffees for roaster`);
    
    // Transform the data to match the Coffee interface
    const coffees: Coffee[] = (data || []).map(coffee => {
      return {
        id: coffee.id,
        name: coffee.name,
        roaster: "", // Will be filled in by the component
        origin: coffee.origin || 'Unknown',
        image: coffee.image_url || null,
        rating: 0, // No ratings for official coffees
        price: coffee.price || 0,
        roastLevel: coffee.roast_level || 'Medium',
        processMethod: coffee.process_method || 'Washed',
        flavor: coffee.flavor_notes || 'No flavor notes provided',
        type: coffee.type || 'Single Origin',
        reviewCount: 0 // No reviews for official coffees
      };
    });
    
    return coffees;
  } catch (error) {
    console.error('Error in fetchRoasterCoffees:', error);
    return [];
  }
};

// Updated function to create an official coffee for a roaster (admin use only)
export const createCoffeeForRoaster = async (
  roasterId: string, 
  coffeeData: Omit<Coffee, 'id' | 'roaster' | 'rating' | 'reviewCount'>
): Promise<{ success: boolean; coffeeId?: string; error?: string }> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { success: false, error: 'You must be logged in to add a coffee' };
    }
    
    // In a production app, you would check if the user has admin rights here
    // For now, we're assuming all logged-in users are admins
    const { data, error } = await supabase
      .from('coffees')
      .insert({
        roaster_id: roasterId,
        name: coffeeData.name,
        origin: coffeeData.origin,
        price: coffeeData.price,
        roast_level: coffeeData.roastLevel,
        process_method: coffeeData.processMethod,
        flavor_notes: coffeeData.flavor,
        type: coffeeData.type,
        image_url: coffeeData.image,
        created_by: null  // Set to null to mark as an official coffee
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating coffee:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, coffeeId: data.id };
  } catch (error) {
    console.error('Error in createCoffeeForRoaster:', error);
    return { success: false, error: 'Failed to create coffee' };
  }
};

// New function to bulk add multiple coffees to a roaster
export const bulkAddCoffeesToRoaster = async (
  roasterId: string,
  coffeesList: Array<Omit<Coffee, 'id' | 'roaster' | 'rating' | 'reviewCount'>>
): Promise<{ 
  success: boolean; 
  count?: number; 
  error?: string;
  failedCoffees?: string[];
}> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { success: false, error: 'You must be logged in to add coffees' };
    }
    
    const results = await Promise.all(
      coffeesList.map(async (coffee) => {
        const result = await createCoffeeForRoaster(roasterId, coffee);
        return {
          name: coffee.name,
          success: result.success,
          error: result.error
        };
      })
    );
    
    const successCount = results.filter(r => r.success).length;
    const failedCoffees = results.filter(r => !r.success).map(r => `${r.name}: ${r.error}`);
    
    return { 
      success: successCount > 0, 
      count: successCount,
      failedCoffees: failedCoffees.length > 0 ? failedCoffees : undefined
    };
  } catch (error) {
    console.error('Error in bulkAddCoffeesToRoaster:', error);
    return { success: false, error: 'Failed to add coffees' };
  }
};
