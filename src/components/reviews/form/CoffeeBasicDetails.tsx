
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  coffeeTypes
}: CoffeeBasicDetailsProps) => {
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
        />
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
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="origin" className="block text-sm font-medium">
            Origin
          </label>
          <Select 
            value={origin} 
            onValueChange={(value: CoffeeOrigin) => setOrigin(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select origin" />
            </SelectTrigger>
            <SelectContent>
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
          >
            <SelectTrigger>
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
