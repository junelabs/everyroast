
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
}

const CoffeeProcessDetails = ({
  roastLevel,
  setRoastLevel,
  processMethod,
  setProcessMethod,
  flavor,
  setFlavor,
  roastLevels,
  processMethods
}: CoffeeProcessDetailsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="roastLevel" className="block text-sm font-medium">
            Roast Level
          </label>
          <Select 
            value={roastLevel} 
            onValueChange={(value: RoastLevel) => setRoastLevel(value)}
          >
            <SelectTrigger>
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
          <label htmlFor="processMethod" className="block text-sm font-medium">
            Process Method
          </label>
          <Select 
            value={processMethod} 
            onValueChange={(value: ProcessMethod) => setProcessMethod(value)}
          >
            <SelectTrigger>
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
          Flavor Notes
        </label>
        <Input
          id="flavor"
          placeholder="e.g., Floral, Citrus, Chocolate"
          value={flavor}
          onChange={(e) => setFlavor(e.target.value)}
        />
      </div>
    </>
  );
};

export default CoffeeProcessDetails;
