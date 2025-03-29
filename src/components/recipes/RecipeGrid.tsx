
import React from 'react';
import RecipeCard from './RecipeCard';
import { Coffee, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Recipe {
  id: string;
  coffee_id: string;
  coffee_name: string;
  roaster_name: string;
  brewing_method: string;
  dosage?: number;
  water?: number;
  temperature?: number;
  brew_time?: string;
  brew_notes?: string;
  user_name?: string;
  created_at: string;
  image_url?: string | null;
}

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  emptyMessage?: string;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ 
  recipes, 
  isLoading,
  emptyMessage = "No recipes found" 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index} 
            className="h-64 bg-gray-100 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-8">
          <UtensilsCrossed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Discover and save brewing recipes to try with your favorite coffees.
          </p>
          <Link to="/profile">
            <Button className="bg-roast-500 hover:bg-roast-600">
              Add a Coffee Review
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          coffeeName={recipe.coffee_name}
          roaster={recipe.roaster_name}
          brewingMethod={recipe.brewing_method}
          dosage={recipe.dosage}
          water={recipe.water}
          temperature={recipe.temperature}
          brewTime={recipe.brew_time}
          brewNotes={recipe.brew_notes}
          userName={recipe.user_name}
          coffeeId={recipe.coffee_id}
          createdAt={recipe.created_at}
          imageUrl={recipe.image_url}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
