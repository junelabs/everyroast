
import { CoffeeOrigin, ProcessMethod, RoastLevel } from "@/types/coffee";

// These functions return icon names from lucide-react that match the data
export const getRoastLevelIcon = (level: RoastLevel): string => {
  return 'flame'; // Use flame icon for all roast levels
};

export const getProcessMethodIcon = (method: ProcessMethod): string => {
  switch (method) {
    case 'Washed': return 'droplets';
    case 'Natural': return 'leaf';
    case 'Honey': return 'beaker';
    case 'Anaerobic': return 'flask-round'; 
    default: return 'beaker';
  }
};

export const getOriginIcon = (origin: CoffeeOrigin): string => {
  // Return map-pin for all origins
  return 'map-pin';
};

export const getPriceIcon = (): string => {
  return 'dollar-sign';
};
