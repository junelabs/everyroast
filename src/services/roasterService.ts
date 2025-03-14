
import { supabase } from "@/integrations/supabase/client";
import { Roaster } from "@/components/roasters/RoasterCard";
import { roasterData } from "@/data/mockRoasterData";

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
    
    // Transform the data to match the Roaster interface
    const roasters: Roaster[] = (data || []).map(item => ({
      id: item.id,
      name: item.name,
      location: item.location,
      description: item.description,
      website: item.website,
      instagram: item.instagram,
      logo_url: item.logo_url,
      coffeeCount: Math.floor(Math.random() * 15) + 1 // Temporary random count until we implement coffee counting
    }));
    
    return roasters;
  } catch (error) {
    console.error('Error in fetchRoasters:', error);
    // Fall back to mock data if there's an error, but do it faster
    return roasterData.slice(0, 50); // Return only first 50 mock entries for faster rendering
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
    
    // Transform the data to match the Roaster interface
    const roaster: Roaster = {
      id: data.id,
      name: data.name,
      location: data.location,
      description: data.description,
      website: data.website,
      instagram: data.instagram,
      logo_url: data.logo_url,
      coffeeCount: Math.floor(Math.random() * 15) + 1 // Temporary random count until we implement coffee counting
    };
    
    return roaster;
  } catch (error) {
    console.error('Error in fetchRoasterById:', error);
    // Fall back to mock data if there's an error
    const roaster = roasterData.find(r => r.id === id);
    return roaster || null;
  }
};
