
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { CoffeeOrigin, CoffeeType } from "@/types/coffee";

interface CoffeeBasicDetailsProps {
  coffeeName: string;
  setCoffeeName: (name: string) => void;
  roaster: string;
  setRoaster: (roaster: string) => void;
  origin: CoffeeOrigin;
  setOrigin: (origin: CoffeeOrigin) => void;
  coffeeType: CoffeeType;
  setCoffeeType: (type: CoffeeType) => void;
  origins: CoffeeOrigin[];
  coffeeTypes: CoffeeType[];
  readOnly?: boolean;
  showValidationErrors?: boolean;
}

const CoffeeBasicDetails = ({
  coffeeName,
  setCoffeeName,
  roaster,
  setRoaster,
  origin,
  setOrigin,
  coffeeType,
  setCoffeeType,
  origins,
  coffeeTypes,
  readOnly = false,
  showValidationErrors = false
}: CoffeeBasicDetailsProps) => {
  const isNameEmpty = showValidationErrors && coffeeName.trim().length === 0;
  const isRoasterEmpty = showValidationErrors && roaster.trim().length === 0;

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="coffeeName" className="block text-sm font-medium">
          Coffee Name *
        </label>
        <Input
          id="coffeeName"
          placeholder="e.g., Ethiopian Yirgacheffe"
          value={coffeeName}
          onChange={(e) => setCoffeeName(e.target.value)}
          required
          readOnly={readOnly}
          className={`${readOnly ? "bg-gray-100" : ""} ${isNameEmpty ? "border-red-400 bg-red-50" : ""}`}
        />
        {isNameEmpty && (
          <p className="text-sm text-red-500 mt-1">Coffee name is required</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="roaster" className="block text-sm font-medium">
          Roaster *
        </label>
        <Input
          id="roaster"
          placeholder="e.g., Stumptown Coffee"
          value={roaster}
          onChange={(e) => setRoaster(e.target.value)}
          required
          readOnly={readOnly}
          className={`${readOnly ? "bg-gray-100" : ""} ${isRoasterEmpty ? "border-red-400 bg-red-50" : ""}`}
        />
        {isRoasterEmpty && (
          <p className="text-sm text-red-500 mt-1">Roaster name is required</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="origin" className="block text-sm font-medium flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-500" />
            Origin
          </label>
          <Select 
            value={origin} 
            onValueChange={(value: CoffeeOrigin) => setOrigin(value)}
            disabled={readOnly}
          >
            <SelectTrigger className={readOnly ? "bg-gray-100" : ""}>
              <SelectValue placeholder="Select origin" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {origins.map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="coffeeType" className="block text-sm font-medium">
            Type
          </label>
          <Select 
            value={coffeeType} 
            onValueChange={(value: CoffeeType) => setCoffeeType(value)}
            disabled={readOnly}
          >
            <SelectTrigger className={readOnly ? "bg-gray-100" : ""}>
              <SelectValue placeholder="Select coffee type" />
            </SelectTrigger>
            <SelectContent>
              {coffeeTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default CoffeeBasicDetails;
