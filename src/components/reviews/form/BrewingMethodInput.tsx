
import { Input } from "@/components/ui/input";

interface BrewingMethodInputProps {
  brewingMethod: string;
  setBrewingMethod: (method: string) => void;
}

const BrewingMethodInput = ({ 
  brewingMethod, 
  setBrewingMethod 
}: BrewingMethodInputProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Brewing Method</h3>
      <div className="grid gap-4">
        <div className="space-y-2">
          <label htmlFor="brewing-method" className="text-sm font-medium">
            Brewing Method
          </label>
          <Input
            id="brewing-method"
            value={brewingMethod}
            onChange={(e) => setBrewingMethod(e.target.value)}
            placeholder="French Press, V60, Espresso, etc."
          />
        </div>
      </div>
    </div>
  );
};

export default BrewingMethodInput;
