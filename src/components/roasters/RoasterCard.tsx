
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

export interface Roaster {
  id: string;
  name: string;
  location?: string | null;
  description?: string | null;
  logo_url?: string | null;
  website?: string | null;
  coffeeCount?: number;
}

interface RoasterCardProps {
  roaster: Roaster;
}

const RoasterCard: React.FC<RoasterCardProps> = ({ roaster }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="h-16 w-16 flex items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
          {roaster.logo_url ? (
            <img 
              src={roaster.logo_url} 
              alt={`${roaster.name} logo`} 
              className="h-full w-full object-cover"
            />
          ) : (
            <Coffee className="h-8 w-8 text-roast-400" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{roaster.name}</h3>
          {roaster.location && (
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{roaster.location}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-1">
        {roaster.description ? (
          <p className="text-gray-600 line-clamp-3">{roaster.description}</p>
        ) : (
          <p className="text-gray-400 italic">No description available</p>
        )}
        
        {roaster.coffeeCount !== undefined && (
          <Badge variant="outline" className="mt-3">
            <Coffee className="h-3 w-3 mr-1" />
            {roaster.coffeeCount} {roaster.coffeeCount === 1 ? 'coffee' : 'coffees'}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="pt-4 flex justify-between">
        {roaster.website && (
          <Button variant="outline" size="sm" asChild>
            <a 
              href={roaster.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Globe className="h-4 w-4 mr-2" />
              Website
            </a>
          </Button>
        )}
        <Button size="sm" className="ml-auto bg-roast-500 hover:bg-roast-600" asChild>
          <Link to={`/roasters/${roaster.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoasterCard;
