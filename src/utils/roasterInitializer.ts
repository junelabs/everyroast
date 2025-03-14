
import { supabase } from "@/integrations/supabase/client";
import { roasterData } from "@/data/mockRoasterData";
import { addNewRoasters } from "@/services/roasterService";
import { useToast } from "@/components/ui/use-toast";

// This utility function initializes the roaster database by adding the international roasters
// This can be called when the app starts or from an admin page
export const initializeRoasterDatabase = async (): Promise<void> => {
  console.log("Initializing roaster database with international roasters");
  
  try {
    // Get a count of roasters in the database
    const { count, error } = await supabase
      .from('roasters')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking roaster count:', error);
      return;
    }
    
    console.log(`Current roaster count in database: ${count}`);
    
    // If the database has fewer than 50 roasters, add the new ones
    if (count !== null && count < 50) {
      console.log(`Only ${count} roasters found in database. Adding international roasters...`);
      
      // Extract relevant data from mock roasters (exclude id and coffeeCount)
      const roastersToAdd = roasterData
        .filter(r => parseInt(r.id) >= 57) // Only add the new international roasters (IDs 57+)
        .map(({ id, coffeeCount, ...rest }) => rest);
      
      console.log(`Preparing to add ${roastersToAdd.length} international roasters to the database`);
      
      // Add the roasters to the database
      await addNewRoasters(roastersToAdd);
      console.log(`Added ${roastersToAdd.length} international roasters to the database`);
    } else {
      console.log("Database already has sufficient roasters. Skipping initialization.");
    }
  } catch (error) {
    console.error('Error initializing roaster database:', error);
  }
};
