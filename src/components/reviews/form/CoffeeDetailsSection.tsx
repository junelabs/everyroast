
import { CoffeeOrigin, RoastLevel, ProcessMethod, CoffeeType, SizeUnit } from "@/types/coffee";
import CoffeeBasicDetails from "./CoffeeBasicDetails";
import CoffeeSizePrice from "./CoffeeSizePrice";
import CoffeeProcessDetails from "./CoffeeProcessDetails";

interface CoffeeDetailsSectionProps {
  coffeeName: string;
  setCoffeeName: (name: string) => void;
  roaster: string;
  setRoaster: (roaster: string) => void;
  origin: CoffeeOrigin;
  setOrigin: (origin: CoffeeOrigin) => void;
  coffeeType: CoffeeType;
  setCoffeeType: (type: CoffeeType) => void;
  price: number;
  setPrice: (price: number) => void;
  size: number;
  setSize: (size: number) => void;
  sizeUnit: SizeUnit;
  setSizeUnit: (unit: SizeUnit) => void;
  roastLevel: RoastLevel;
  setRoastLevel: (level: RoastLevel) => void;
  processMethod: ProcessMethod;
  setProcessMethod: (method: ProcessMethod) => void;
  flavor: string;
  setFlavor: (flavor: string) => void;
  origins: CoffeeOrigin[];
  roastLevels: RoastLevel[];
  processMethods: ProcessMethod[];
  coffeeTypes: CoffeeType[];
  sizeUnits: SizeUnit[];
  readOnly?: boolean;
  hidePriceSize?: boolean;
}

const CoffeeDetailsSection = ({
  coffeeName,
  setCoffeeName,
  roaster,
  setRoaster,
  origin,
  setOrigin,
  coffeeType,
  setCoffeeType,
  price,
  setPrice,
  size,
  setSize,
  sizeUnit,
  setSizeUnit,
  roastLevel,
  setRoastLevel,
  processMethod,
  setProcessMethod,
  flavor,
  setFlavor,
  origins,
  roastLevels,
  processMethods,
  coffeeTypes,
  sizeUnits,
  readOnly = false,
  hidePriceSize = false
}: CoffeeDetailsSectionProps) => {
  return (
    <div className="space-y-4 border-b pb-4">
      <h3 className="font-medium">Coffee Details</h3>
      
      <CoffeeBasicDetails
        coffeeName={coffeeName}
        setCoffeeName={setCoffeeName}
        roaster={roaster}
        setRoaster={setRoaster}
        origin={origin}
        setOrigin={setOrigin}
        coffeeType={coffeeType}
        setCoffeeType={setCoffeeType}
        origins={origins}
        coffeeTypes={coffeeTypes}
        readOnly={readOnly}
      />
      
      {!hidePriceSize && (
        <CoffeeSizePrice
          price={price}
          setPrice={setPrice}
          size={size}
          setSize={setSize}
          sizeUnit={sizeUnit}
          setSizeUnit={setSizeUnit}
          sizeUnits={sizeUnits}
          readOnly={readOnly}
        />
      )}
      
      <CoffeeProcessDetails
        roastLevel={roastLevel}
        setRoastLevel={setRoastLevel}
        processMethod={processMethod}
        setProcessMethod={setProcessMethod}
        flavor={flavor}
        setFlavor={setFlavor}
        roastLevels={roastLevels}
        processMethods={processMethods}
        readOnly={readOnly}
      />
    </div>
  );
};

export default CoffeeDetailsSection;
