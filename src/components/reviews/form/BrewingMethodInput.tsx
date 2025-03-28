
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CupSoda, Droplets, Timer, Thermometer, FileText } from "lucide-react";

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
}

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
  setBrewNotes
}: BrewingMethodInputProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Brewing Information</h3>
      
      <div className="space-y-2">
        <label htmlFor="brewing-method" className="text-sm font-medium flex items-center gap-1">
          <CupSoda className="h-4 w-4 text-gray-500" />
          Brewing Method
        </label>
        <Input
          id="brewing-method"
          value={brewingMethod}
          onChange={(e) => setBrewingMethod(e.target.value)}
          placeholder="French Press, V60, Espresso, etc."
        />
      </div>
      
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
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="temperature" className="text-sm font-medium flex items-center gap-1">
            <Thermometer className="h-4 w-4 text-red-500" />
            Temperature (°C)
          </label>
          <Input
            id="temperature"
            type="number"
            value={temperature || ''}
            onChange={(e) => setTemperature && setTemperature(Number(e.target.value))}
            placeholder="94"
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

      <div className="space-y-2">
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
