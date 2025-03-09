
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SizeUnit } from "@/types/coffee";

interface CoffeeSizePriceProps {
  price: number;
  setPrice: (price: number) => void;
  size: number;
  setSize: (size: number) => void;
  sizeUnit: SizeUnit;
  setSizeUnit: (unit: SizeUnit) => void;
  sizeUnits: SizeUnit[];
}

const CoffeeSizePrice = ({
  price,
  setPrice,
  size,
  setSize,
  sizeUnit,
  setSizeUnit,
  sizeUnits
}: CoffeeSizePriceProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2 col-span-1">
        <label htmlFor="price" className="block text-sm font-medium">
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
        />
      </div>
      
      <div className="space-y-2 col-span-1">
        <label htmlFor="sizeUnit" className="block text-sm font-medium">
          Unit
        </label>
        <Select 
          value={sizeUnit} 
          onValueChange={(value: SizeUnit) => setSizeUnit(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {sizeUnits.map((unit) => (
              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CoffeeSizePrice;
