
import React, { memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Instagram, Coffee } from "lucide-react";

export interface Roaster {
  id: string;
  name: string;
  location?: string | null;
  description?: string | null;
  logo_url?: string | null;
  website?: string | null;
  instagram?: string | null;
  coffeeCount?: number;
}

interface RoasterCardProps {
  roaster: Roaster;
}

// Memoize the component to prevent unnecessary re-renders
const RoasterCard: React.FC<RoasterCardProps> = memo(({ roaster }) => {
  // Generate a random number between 20 and 99 for drinkers count - memoized by component
  const randomDrinkers = React.useMemo(() => 
    Math.floor(Math.random() * (99 - 20 + 1)) + 20
  , []);
  
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-roast-200">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="h-20 w-20 flex items-center justify-center rounded-xl bg-roast-50 border border-roast-100 overflow-hidden">
          {roaster.logo_url ? (
            <img 
              src={roaster.logo_url} 
              alt={`${roaster.name} logo`} 
              className="h-full w-full object-cover"
              loading="lazy" // Add lazy loading for images
            />
          ) : (
            <Coffee className="h-10 w-10 text-roast-300" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{roaster.name}</h3>
          {roaster.location && (
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1 text-roast-400" />
              <span className="text-sm">{roaster.location}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardFooter className="pt-4 flex justify-between border-t border-gray-100">
        <div className="flex gap-1.5">
          {roaster.website && (
            <Button variant="outline" size="sm" asChild className="text-gray-600 h-7 px-2 text-xs">
              <a 
                href={roaster.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Globe className="h-3 w-3 mr-1" />
                Website
              </a>
            </Button>
          )}
          
          {roaster.instagram && (
            <Button variant="outline" size="sm" asChild className="text-gray-600 h-7 px-2 text-xs">
              <a 
                href={`https://instagram.com/${roaster.instagram.replace('@', '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Instagram className="h-3 w-3 mr-1" />
                Instagram
              </a>
            </Button>
          )}
        </div>
        
        <div className="bg-roast-50 text-roast-700 px-2 py-1 rounded-md text-xs font-medium">
          <span className="text-roast-900 font-bold mr-1">{randomDrinkers}</span> drinkers
        </div>
      </CardFooter>
    </Card>
  );
});

// Add display name for better debug experience
RoasterCard.displayName = 'RoasterCard';

export default RoasterCard;
