
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import RecipeGrid from "@/components/recipes/RecipeGrid";

const SavedTab = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserRecipes();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserRecipes = async () => {
    try {
      setIsLoading(true);
      
      // Fetch only reviews created by the current user that have brewing information
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          brewing_method,
          dosage,
          water,
          temperature,
          brew_time,
          brew_notes,
          created_at,
          coffee_id,
          coffees (
            name,
            image_url,
            roasters (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .not('brewing_method', 'is', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our Recipe interface
      const formattedRecipes = data.map(recipe => ({
        id: recipe.id,
        coffee_id: recipe.coffee_id,
        coffee_name: recipe.coffees.name,
        roaster_name: recipe.coffees.roasters.name,
        brewing_method: recipe.brewing_method || '',
        dosage: recipe.dosage,
        water: recipe.water,
        temperature: recipe.temperature,
        brew_time: recipe.brew_time,
        brew_notes: recipe.brew_notes,
        created_at: recipe.created_at,
        image_url: recipe.coffees.image_url
      }));
      
      setRecipes(formattedRecipes);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      toast({
        title: "Error",
        description: "Failed to load your recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <RecipeGrid 
        recipes={recipes} 
        isLoading={isLoading} 
        emptyMessage="You haven't saved any brewing recipes yet" 
      />
    </div>
  );
};

export default SavedTab;
