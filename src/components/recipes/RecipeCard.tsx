
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

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

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onDelete }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Check if we have a valid image URL
  const hasValidImage = recipe.image_url && 
                       !recipe.image_url.includes('placeholder') && 
                       !recipe.image_url.includes('gravatar') && 
                       !recipe.image_url.includes('unsplash');

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {hasValidImage && (
        <div className="h-48 overflow-hidden">
          <img 
            src={recipe.image_url} 
            alt={recipe.coffee_name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-bold">{recipe.coffee_name}</h3>
          <p className="text-gray-600 text-sm">{recipe.roaster_name}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(recipe.created_at)}</p>
        </div>

        <div className="space-y-2 flex-1">
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium mb-2">{recipe.brewing_method}</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Dose</p>
                <p>{recipe.dosage}g</p>
              </div>
              <div>
                <p className="text-gray-500">Water</p>
                <p>{recipe.water}g</p>
              </div>
              <div>
                <p className="text-gray-500">Ratio</p>
                <p>1:{(recipe.water / recipe.dosage).toFixed(1)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>
                <p className="text-gray-500">Temp</p>
                <p>{recipe.temperature}°C</p>
              </div>
              <div>
                <p className="text-gray-500">Time</p>
                <p>{recipe.brew_time}</p>
              </div>
            </div>
          </div>

          {recipe.brew_notes && (
            <div className="text-sm">
              <p className="font-medium">Notes:</p>
              <p className="text-gray-700">{recipe.brew_notes}</p>
            </div>
          )}
        </div>
        
        {onDelete && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="flex items-center text-rose-500 hover:text-rose-600 text-sm"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Recipe
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecipeCard;
