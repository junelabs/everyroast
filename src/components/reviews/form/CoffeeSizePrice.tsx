
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign } from "lucide-react";
import { SizeUnit } from "@/types/coffee";

interface CoffeeSizePriceProps {
  price: number;
  setPrice: (price: number) => void;
  size: number;
  setSize: (size: number) => void;
  sizeUnit: SizeUnit;
  setSizeUnit: (unit: SizeUnit) => void;
  sizeUnits: SizeUnit[];
  readOnly?: boolean;
}

const CoffeeSizePrice = ({
  price,
  setPrice,
  size,
  setSize,
  sizeUnit,
  setSizeUnit,
  sizeUnits,
  readOnly = false
}: CoffeeSizePriceProps) => {
  // Function to get full unit name
  const getUnitLabel = (unit: SizeUnit): string => {
    switch(unit) {
      case 'g': return 'grams';
      case 'oz': return 'ounces';
      default: return unit;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2 col-span-1">
        <label htmlFor="price" className="block text-sm font-medium flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-green-500" />
          Price (USD)
        </label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={price || ''}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          readOnly={readOnly}
          className={readOnly ? "bg-gray-100" : ""}
        />
      </div>
      
      <div className="space-y-2 col-span-1">
        <label htmlFor="size" className="block text-sm font-medium">
          Size
        </label>
        <Input
          id="size"
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={size || ''}
          onChange={(e) => setSize(parseInt(e.target.value) || 0)}
          readOnly={readOnly}
          className={readOnly ? "bg-gray-100" : ""}
        />
      </div>
      
      <div className="space-y-2 col-span-1">
        <label htmlFor="sizeUnit" className="block text-sm font-medium">
          Unit
        </label>
        <Select 
          value={sizeUnit} 
          onValueChange={(value: SizeUnit) => setSizeUnit(value)}
          disabled={readOnly}
        >
          <SelectTrigger className={readOnly ? "bg-gray-100" : ""}>
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {sizeUnits.map((unit) => (
              <SelectItem key={unit} value={unit}>{getUnitLabel(unit)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CoffeeSizePrice;
