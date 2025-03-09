
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Coffee } from "lucide-react";

interface CoffeeSelectorProps {
  onSelect: (coffeeId: string) => void;
}

const CoffeeSelector = ({ onSelect }: CoffeeSelectorProps) => {
  const [search, setSearch] = useState("");
  const [coffees, setCoffees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (search.length > 2) {
      searchCoffees();
    }
  }, [search]);

  const searchCoffees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('coffees')
        .select(`
          id,
          name,
          roaster_id,
          roasters (name)
        `)
        .ilike('name', `%${search}%`)
        .limit(5);

      if (error) {
        console.error("Error searching coffees:", error);
      } else {
        setCoffees(data || []);
      }
    } catch (error) {
      console.error("Error in searchCoffees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for a coffee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {isLoading && (
        <div className="text-center py-2 text-sm text-gray-500">
          Searching...
        </div>
      )}

      {!isLoading && coffees.length > 0 && (
        <div className="space-y-2">
          {coffees.map((coffee) => (
            <Button
              key={coffee.id}
              type="button"
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => onSelect(coffee.id)}
            >
              <Coffee className="h-4 w-4 mr-2 text-roast-500" />
              <div>
                <div className="font-medium">{coffee.name}</div>
                <div className="text-xs text-gray-500">{coffee.roasters?.name}</div>
              </div>
            </Button>
          ))}
        </div>
      )}

      {!isLoading && search.length > 2 && coffees.length === 0 && (
        <div className="text-center py-2 text-sm text-gray-500">
          No coffees found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default CoffeeSelector;
