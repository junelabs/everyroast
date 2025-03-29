
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { CupSoda, Droplets, Thermometer, Timer, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RecipeCardProps {
  coffeeName: string;
  roaster: string;
  brewingMethod: string;
  dosage?: number;
  water?: number;
  temperature?: number;
  brewTime?: string;
  brewNotes?: string;
  userName?: string;
  coffeeId?: string;
  createdAt?: string;
  imageUrl?: string | null;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  coffeeName,
  roaster,
  brewingMethod,
  dosage,
  water,
  temperature,
  brewTime,
  brewNotes,
  userName,
  coffeeId,
  createdAt,
  imageUrl
}) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="text-lg font-semibold line-clamp-1">
              {coffeeId ? (
                <Link to={`/coffee/${coffeeId}`} className="hover:text-roast-500 transition-colors">
                  {coffeeName}
                </Link>
              ) : (
                coffeeName
              )}
            </h3>
            <p className="text-sm text-muted-foreground">{roaster}</p>
          </div>
          
          {imageUrl && (
            <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={imageUrl} 
                alt={coffeeName} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-2 flex-grow">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CupSoda className="h-4 w-4 text-roast-500" />
            <span className="text-sm font-medium">{brewingMethod}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {dosage !== undefined && dosage > 0 && (
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{dosage}g coffee</span>
              </div>
            )}
            
            {water !== undefined && water > 0 && (
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{water}ml water</span>
              </div>
            )}
            
            {temperature !== undefined && temperature > 0 && (
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="text-sm">{temperature}°C</span>
              </div>
            )}
            
            {brewTime && (
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{brewTime}</span>
              </div>
            )}
          </div>
          
          {brewNotes && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 line-clamp-2">{brewNotes}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t text-xs text-muted-foreground flex justify-between">
        {userName && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{userName}</span>
          </div>
        )}
        
        {createdAt && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{new Date(createdAt).toLocaleDateString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
