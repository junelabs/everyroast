
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Coffee, ArrowRight } from "lucide-react";
import RoasterCard from './roasters/RoasterCard';
import { roasterData } from '@/data/mockRoasterData';

const RoasterPreviewSection = () => {
  const navigate = useNavigate();
  
  // Only show the first 3 roasters for the preview
  const previewRoasters = roasterData.slice(0, 3);
  
  const handleViewAllClick = () => {
    navigate('/roasters');
  };
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-roast-800 mb-4">Featured Roasters</h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover exceptional coffee roasters from around the world, each with their own unique approach to the craft.
            </p>
          </div>
          <Button 
            onClick={handleViewAllClick}
            variant="outline" 
            className="mt-6 md:mt-0 text-roast-600 border-roast-300 hover:bg-roast-50 hover:text-roast-700 hover:border-roast-400"
          >
            View All Roasters
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewRoasters.map(roaster => (
            <RoasterCard key={roaster.id} roaster={roaster} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={handleViewAllClick}
            className="bg-roast-500 hover:bg-roast-600 text-white font-medium px-8 py-6 rounded-lg text-lg"
          >
            Explore All Roasters
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RoasterPreviewSection;
