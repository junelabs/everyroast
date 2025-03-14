
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { roasterData } from "@/data/mockRoasterData";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addNewRoasters } from "@/services/roasterService";

// This is an admin utility component that can be used to populate the Supabase database
// with the roaster data from mockRoasterData.ts
const RoasterPopulator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const populateRoasters = async () => {
    setIsLoading(true);
    setResults([]);
    
    try {
      // Create array of roasters without id and coffeeCount (which are not stored in the database)
      const roastersToAdd = roasterData.map(({ id, coffeeCount, ...rest }) => rest);
      
      // Add each roaster to Supabase
      await addNewRoasters(roastersToAdd);
      
      toast({
        title: "Success",
        description: "Roasters have been added to the database",
      });
      
      setResults(["Roasters have been successfully added to the database"]);
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Roaster Database Population Utility</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-4">This utility will add all the roasters from the mock data file to your Supabase database.</p>
        <Button 
          onClick={populateRoasters} 
          disabled={isLoading}
          className="bg-roast-500 hover:bg-roast-600"
        >
          {isLoading ? "Adding Roasters..." : "Add Roasters to Database"}
        </Button>
        
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
