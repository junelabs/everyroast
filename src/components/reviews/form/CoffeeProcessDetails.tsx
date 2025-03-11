
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flame, Droplets } from "lucide-react"; 
import { RoastLevel, ProcessMethod } from "@/types/coffee";

interface CoffeeProcessDetailsProps {
  roastLevel: RoastLevel;
  setRoastLevel: (level: RoastLevel) => void;
  processMethod: ProcessMethod;
  setProcessMethod: (method: ProcessMethod) => void;
  flavor: string;
  setFlavor: (flavor: string) => void;
  roastLevels: RoastLevel[];
  processMethods: ProcessMethod[];
  readOnly?: boolean;
}

const CoffeeProcessDetails = ({
  roastLevel,
  setRoastLevel,
  processMethod,
  setProcessMethod,
  flavor,
  setFlavor,
  roastLevels,
  processMethods,
  readOnly = false
}: CoffeeProcessDetailsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="roastLevel" className="block text-sm font-medium flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            Roast Level
          </label>
          <Select 
            value={roastLevel} 
            onValueChange={(value: RoastLevel) => setRoastLevel(value)}
            defaultValue="Light"
            disabled={readOnly}
          >
            <SelectTrigger className={readOnly ? "bg-gray-100" : ""}>
              <SelectValue placeholder="Select roast level" />
            </SelectTrigger>
            <SelectContent>
              {roastLevels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="processMethod" className="block text-sm font-medium flex items-center gap-1">
            <Droplets className="h-4 w-4 text-blue-500" />
            Process Method
          </label>
          <Select 
            value={processMethod} 
            onValueChange={(value: ProcessMethod) => setProcessMethod(value)}
            disabled={readOnly}
          >
            <SelectTrigger className={readOnly ? "bg-gray-100" : ""}>
              <SelectValue placeholder="Select process method" />
            </SelectTrigger>
            <SelectContent>
              {processMethods.map((method) => (
                <SelectItem key={method} value={method}>{method}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="flavor" className="block text-sm font-medium">
          Flavor Notes (separate by commas)
        </label>
        <Input
          id="flavor"
          placeholder="e.g., Floral, Citrus, Chocolate"
          value={flavor}
          onChange={(e) => setFlavor(e.target.value)}
          readOnly={readOnly}
          className={readOnly ? "bg-gray-100" : ""}
        />
        {!readOnly && flavor && (
          <div className="flex flex-wrap gap-2 mt-2">
            {flavor.split(',').map((note, index) => (
              note.trim() && (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {note.trim()}
                </span>
              )
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CoffeeProcessDetails;
