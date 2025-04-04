
import React from 'react';
import RecipeCard from './RecipeCard';
import { UtensilsCrossed } from 'lucide-react';

interface Recipe {
  id: string;
  coffee_id: string;
  coffee_name: string;
  roaster_name: string;
  brewing_method: string;
  dosage: number;
  water: number;
  temperature: number;
  brew_time: string;
  brew_notes?: string;
  created_at: string;
  image_url?: string;
}

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  emptyMessage?: string;
  onDelete?: (id: string) => void;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ 
  recipes, 
  isLoading, 
  emptyMessage = "No recipes found",
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roast-500"></div>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No recipes yet</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id}
          recipe={recipe}
          onDelete={onDelete ? () => onDelete(recipe.id) : undefined}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
