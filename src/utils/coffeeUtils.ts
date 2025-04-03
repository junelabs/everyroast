
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

// Add these emoji functions for backwards compatibility
export const getRoastLevelEmoji = (level: RoastLevel): string => {
  // Return a single fire emoji regardless of roast level
  return '🔥';
};

export const getProcessMethodEmoji = (method: ProcessMethod): string => {
  switch (method) {
    case 'Washed': return '💧';
    case 'Natural': return '🍃';
    case 'Honey': return '🍯';
    case 'Anaerobic': return '🧪';
    default: return '⚗️';
  }
};
