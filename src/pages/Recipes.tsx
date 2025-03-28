
import React, { useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, CupSoda, Coffee, Clock } from "lucide-react";

const Recipes = () => {
  useEffect(() => {
    document.title = "Every Roast | Recipes";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Brewing Recipes</h1>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-roast-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Recipe Explorer</h2>
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Brewing Method</h3>
              <RadioGroup defaultValue="pour-over" className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pour-over" id="pour-over" />
                  <Label htmlFor="pour-over">Pour Over</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="espresso" id="espresso" />
                  <Label htmlFor="espresso">Espresso</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="french-press" id="french-press" />
                  <Label htmlFor="french-press">French Press</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="aeropress" id="aeropress" />
                  <Label htmlFor="aeropress">Aeropress</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <RecipeCard 
              title="V60 Pour Over" 
              description="A clean, bright cup with clear flavors"
              steps={[
                "Rinse filter and preheat brewer",
                "Add 18g medium-fine coffee",
                "Pour 50g water for bloom, wait 30s",
                "Pour to 150g by 1:00",
                "Pour to 250g by 1:30",
                "Pour to 300g by 2:00",
                "Total brew time: 2:45-3:15"
              ]}
              params={{
                ratio: "1:16.7",
                grind: "Medium-fine",
                temp: "94°C / 201°F",
                time: "2:45-3:15"
              }}
            />
            
            <RecipeCard 
              title="Aeropress (Inverted)" 
              description="Rich and full-bodied without bitterness"
              steps={[
                "Assemble inverted Aeropress with plunger at 4",
                "Add 17g medium-coarse coffee",
                "Add 220g water at 85°C",
                "Stir gently 3 times",
                "Steep for 2 minutes",
                "Attach filter cap, flip and press gently",
                "Total brew time: 2:30"
              ]}
              params={{
                ratio: "1:13",
                grind: "Medium-coarse",
                temp: "85°C / 185°F",
                time: "2:30"
              }}
            />
          </div>
          
          <div className="mt-12 text-center text-gray-600">
            <p className="mb-2">More recipes coming soon!</p>
            <p>Share your favorite brewing methods in the community section</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface RecipeCardProps {
  title: string;
  description: string;
  steps: string[];
  params: {
    ratio: string;
    grind: string;
    temp: string;
    time: string;
  };
}

const RecipeCard = ({ title, description, steps, params }: RecipeCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-roast-100 p-4">
        <h3 className="text-xl font-semibold text-roast-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-roast-500" />
            <span className="text-sm">Ratio: {params.ratio}</span>
          </div>
          <div className="flex items-center gap-2">
            <CupSoda className="h-4 w-4 text-roast-500" />
            <span className="text-sm">Grind: {params.grind}</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-roast-500" />
            <span className="text-sm">Temp: {params.temp}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-roast-500" />
            <span className="text-sm">Time: {params.time}</span>
          </div>
        </div>
        
        <h4 className="font-medium mb-2">Steps:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Recipes;
