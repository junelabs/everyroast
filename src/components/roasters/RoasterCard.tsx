
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

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

const RoasterCard: React.FC<RoasterCardProps> = ({ roaster }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-roast-200">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="h-20 w-20 flex items-center justify-center rounded-xl bg-roast-50 border border-roast-100 overflow-hidden">
          {roaster.logo_url ? (
            <img 
              src={roaster.logo_url} 
              alt={`${roaster.name} logo`} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 bg-roast-100 rounded-md"></div>
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
      
      <CardContent className="py-3 flex-1">
        {roaster.description ? (
          <p className="text-gray-600 line-clamp-3">{roaster.description}</p>
        ) : (
          <p className="text-gray-500">
            Specialty coffee roaster based in {roaster.location}. 
            {roaster.instagram && (
              <span> Follow us on Instagram.</span>
            )}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="pt-4 flex justify-between border-t border-gray-100">
        <div className="flex gap-2">
          {roaster.website && (
            <Button variant="outline" size="sm" asChild className="text-gray-600">
              <a 
                href={roaster.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Globe className="h-4 w-4 mr-1" />
                Website
              </a>
            </Button>
          )}
          
          {roaster.instagram && (
            <Button variant="outline" size="sm" asChild className="text-gray-600">
              <a 
                href={`https://instagram.com/${roaster.instagram.replace('@', '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Instagram className="h-4 w-4 mr-1" />
                Instagram
              </a>
            </Button>
          )}
        </div>
        
        <Button 
          size="sm" 
          className="ml-auto bg-roast-500 hover:bg-roast-600" 
          asChild
        >
          <Link to={`/roasters/${roaster.id}`}>
            # drinkers this week
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoasterCard;
