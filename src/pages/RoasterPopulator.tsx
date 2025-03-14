
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { roasterData } from "@/data/mockRoasterData";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addNewRoasters } from "@/services/roasterService";
import { initializeRoasterDatabase } from "@/utils/roasterInitializer";

// This is an admin utility component that can be used to populate the Supabase database
// with the roaster data from mockRoasterData.ts
const RoasterPopulator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [roasterCount, setRoasterCount] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check current roaster count on component mount
    const checkRoasterCount = async () => {
      try {
        const { count, error } = await supabase
          .from('roasters')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error checking roaster count:', error);
          return;
        }
        
        setRoasterCount(count);
      } catch (error) {
        console.error('Error in checkRoasterCount:', error);
      }
    };
    
    checkRoasterCount();
  }, []);

  const populateAllRoasters = async () => {
    setIsLoading(true);
    setResults([]);
    
    try {
      // Create array of all roasters without id and coffeeCount (which are not stored in the database)
      const roastersToAdd = roasterData.map(({ id, coffeeCount, ...rest }) => rest);
      
      // Add each roaster to Supabase
      await addNewRoasters(roastersToAdd);
      
      toast({
        title: "Success",
        description: "All roasters have been added to the database",
      });
      
      setResults(["All roasters have been successfully added to the database"]);
      
      // Update roaster count
      const { count } = await supabase
        .from('roasters')
        .select('*', { count: 'exact', head: true });
      
      setRoasterCount(count);
    } catch (error) {
      console.error('Error populating roasters:', error);
      toast({
        title: "Error",
        description: "Failed to add roasters to the database",
        variant: "destructive"
      });
      setResults([`Error: ${error instanceof Error ? error.message : String(error)}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const populateInternationalRoasters = async () => {
    setIsLoading(true);
    setResults([]);
    
    try {
      // Run the initializer function directly
      await initializeRoasterDatabase();
      
      toast({
        title: "Success",
        description: "International roasters have been added to the database",
      });
      
      setResults(["International roasters have been successfully added to the database"]);
      
      // Update roaster count
      const { count } = await supabase
        .from('roasters')
        .select('*', { count: 'exact', head: true });
      
      setRoasterCount(count);
    } catch (error) {
      console.error('Error populating international roasters:', error);
      toast({
        title: "Error",
        description: "Failed to add international roasters to the database",
        variant: "destructive"
      });
      setResults([`Error: ${error instanceof Error ? error.message : String(error)}`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Roaster Database Population Utility</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-4">This utility will add roasters from the mock data file to your Supabase database.</p>
        
        {roasterCount !== null && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p>Current roaster count in database: <span className="font-semibold">{roasterCount}</span></p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-3 mb-4">
          <Button 
            onClick={populateAllRoasters} 
            disabled={isLoading}
            className="bg-roast-500 hover:bg-roast-600"
          >
            {isLoading ? "Adding Roasters..." : "Add ALL Roasters to Database"}
          </Button>
          
          <Button 
            onClick={populateInternationalRoasters} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? "Adding Roasters..." : "Add International Roasters Only"}
          </Button>
        </div>
        
        {results.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Results:</h2>
            <ul className="list-disc pl-5">
              {results.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoasterPopulator;
