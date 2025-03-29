
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import { useToast } from '@/hooks/use-toast';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Every Roast | Brewing Recipes";
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      
      // Fetch only reviews that have brewing information
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
          user_id,
          coffees (
            name,
            image_url,
            roasters (
              name
            )
          )
        `)
        .not('brewing_method', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      // Get user profiles separately to avoid join issues
      const userIds = [...new Set(data.map(item => item.user_id))];
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;
      
      // Create a map of user_id to username
      const userMap = profilesData.reduce((acc, profile) => {
        acc[profile.id] = profile.username;
        return acc;
      }, {});
      
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
        user_name: userMap[recipe.user_id] || 'Anonymous',
        created_at: recipe.created_at,
        image_url: null // Not passing the image URL to the recipe card
      }));
      
      setRecipes(formattedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Error",
        description: "Failed to load recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Brewing Recipes</h1>
            <p className="text-gray-600">
              Discover brewing recipes shared by coffee enthusiasts
            </p>
          </div>
          
          <RecipeGrid 
            recipes={recipes} 
            isLoading={isLoading} 
            emptyMessage="No brewing recipes found" 
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
