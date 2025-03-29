
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CupSoda, Droplets, Timer, Thermometer, FileText, HelpCircle, Coffee } from "lucide-react";
import { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BrewingMethodInputProps {
  brewingMethod: string;
  setBrewingMethod: (method: string) => void;
  dosage?: number; 
  setDosage?: (dosage: number) => void;
  water?: number;
  setWater?: (water: number) => void;
  temperature?: number;
  setTemperature?: (temp: number) => void;
  brewTime?: string;
  setBrewTime?: (time: string) => void;
  brewNotes?: string;
  setBrewNotes?: (notes: string) => void;
  showHelpText?: boolean;
}

const commonBrewMethods = [
  "V60", "AeroPress", "Chemex", "French Press", "Espresso", 
  "Moka Pot", "Kalita Wave", "Clever Dripper", "Cold Brew", "Siphon"
];

const BrewingMethodInput = ({ 
  brewingMethod, 
  setBrewingMethod,
  dosage,
  setDosage,
  water,
  setWater,
  temperature,
  setTemperature,
  brewTime,
  setBrewTime,
  brewNotes,
  setBrewNotes,
  showHelpText = false
}: BrewingMethodInputProps) => {
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [displayTemp, setDisplayTemp] = useState<number | undefined>(temperature);
  const [customMethod, setCustomMethod] = useState<string>("");
  const [isCustomMethod, setIsCustomMethod] = useState<boolean>(false);

  // Update custom method state when brew method changes or component mounts
  useEffect(() => {
    if (brewingMethod && !commonBrewMethods.includes(brewingMethod)) {
      setIsCustomMethod(true);
      setCustomMethod(brewingMethod);
    } else {
      setIsCustomMethod(false);
    }
  }, []);

  // Convert between C and F when unit or temperature changes
  useEffect(() => {
    if (temperature === undefined) {
      setDisplayTemp(undefined);
      return;
    }
    
    if (tempUnit === 'C') {
      setDisplayTemp(temperature);
    } else {
      // Convert C to F: (C * 9/5) + 32
      setDisplayTemp(Math.round((temperature * 9/5) + 32));
    }
  }, [temperature, tempUnit]);

  const handleTempChange = (value: string) => {
    if (!setTemperature) return;
    
    const tempValue = value === '' ? undefined : Number(value);
    if (tempValue === undefined) {
      setTemperature(0);
      return;
    }
    
    if (tempUnit === 'C') {
      setTemperature(tempValue);
    } else {
      // Convert F to C: (F - 32) * 5/9
      setTemperature(Math.round((tempValue - 32) * 5/9));
    }
  };

  const toggleTempUnit = () => {
    setTempUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  const handleBrewMethodChange = (value: string) => {
    setBrewingMethod(value);
    setIsCustomMethod(false);
  };

  const handleCustomMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomMethod(value);
    setBrewingMethod(value);
  };

  const toggleCustomMethod = () => {
    setIsCustomMethod(prev => !prev);
    if (!isCustomMethod) {
      setBrewingMethod("");
    } else {
      setCustomMethod("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="brewing-method" className="text-sm font-medium flex items-center gap-1">
          <CupSoda className="h-4 w-4 text-gray-500" />
          Brewing Method
          {showHelpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-gray-400 ml-1 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-[200px]">Select how you brewed this coffee</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </label>
        
        {!isCustomMethod ? (
          <div className="space-y-2">
            <Select 
              value={brewingMethod} 
              onValueChange={handleBrewMethodChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brewing method" />
              </SelectTrigger>
              <SelectContent>
                {commonBrewMethods.map((method) => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button 
              type="button" 
              onClick={toggleCustomMethod}
              className="text-xs text-gray-500 underline"
            >
              Use a custom brewing method
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              id="custom-brewing-method"
              value={customMethod}
              onChange={handleCustomMethodChange}
              placeholder="Enter your brewing method"
            />
            <button 
              type="button" 
              onClick={toggleCustomMethod}
              className="text-xs text-gray-500 underline"
            >
              Select from common methods
            </button>
          </div>
        )}
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Coffee className="h-4 w-4 mr-1 text-brown-500" />
          Recipe Details
          {showHelpText && (
            <span className="text-xs text-gray-500 ml-2">(These details help others brew better coffee)</span>
          )}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="dosage" className="text-sm font-medium flex items-center gap-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              Dose (g)
            </label>
            <Input
              id="dosage"
              type="number"
              value={dosage || ''}
              onChange={(e) => setDosage && setDosage(Number(e.target.value))}
              placeholder="18"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="water" className="text-sm font-medium flex items-center gap-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              Water (ml)
            </label>
            <Input
              id="water"
              type="number"
              value={water || ''}
              onChange={(e) => setWater && setWater(Number(e.target.value))}
              placeholder="300"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="temperature" className="text-sm font-medium flex items-center gap-1">
              <Thermometer className="h-4 w-4 text-red-500" />
              Temperature
              <Toggle 
                size="sm" 
                pressed={tempUnit === 'F'} 
                onPressedChange={toggleTempUnit}
                className="ml-2 px-2 py-0 h-6 text-xs"
              >
                °{tempUnit}
              </Toggle>
            </label>
            <Input
              id="temperature"
              type="number"
              value={displayTemp || ''}
              onChange={(e) => handleTempChange(e.target.value)}
              placeholder={tempUnit === 'C' ? "94" : "201"}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="brew-time" className="text-sm font-medium flex items-center gap-1">
              <Timer className="h-4 w-4 text-gray-500" />
              Brew Time
            </label>
            <Input
              id="brew-time"
              value={brewTime || ''}
              onChange={(e) => setBrewTime && setBrewTime(e.target.value)}
              placeholder="2:30"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <label htmlFor="brew-notes" className="text-sm font-medium flex items-center gap-1">
          <FileText className="h-4 w-4 text-gray-500" />
          Detailed Notes
        </label>
        <Textarea
          id="brew-notes"
          value={brewNotes || ''}
          onChange={(e) => setBrewNotes && setBrewNotes(e.target.value)}
          placeholder="Add any additional notes about your brewing process, adjustments, or observations..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default BrewingMethodInput;
