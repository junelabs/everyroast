
import { CoffeeOrigin, ProcessMethod, RoastLevel } from "@/types/coffee";

export const getRoastLevelEmoji = (level: RoastLevel) => {
  return '🔥'; // Using fire emoji for all roast levels
};

export const getProcessMethodEmoji = (method: ProcessMethod) => {
  switch (method) {
    case 'Washed': return '💦';
    case 'Natural': return '🌿';
    case 'Honey': return '🍯';
    case 'Anaerobic': return '🔄'; // Default for anaerobic
    default: return '🔄';
  }
};

export const getCountryEmoji = (origin: CoffeeOrigin) => {
  // Americas: Colombia, Brazil, Guatemala, Costa Rica
  // Africa/Europe: Ethiopia, Kenya
  const americasCountries = ['Colombia', 'Brazil', 'Guatemala', 'Costa Rica'];
  return americasCountries.includes(origin) ? '🌎' : '🌍';
};
