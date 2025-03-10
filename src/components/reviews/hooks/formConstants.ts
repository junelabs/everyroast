
import { CoffeeOrigin, RoastLevel, ProcessMethod, CoffeeType, SizeUnit } from "@/types/coffee";

export const origins: CoffeeOrigin[] = [
  'Ethiopia', 'Colombia', 'Brazil', 'Guatemala', 'Costa Rica', 'Kenya',
  'Peru', 'Indonesia', 'Vietnam', 'Honduras', 'Mexico', 'Rwanda',
  'Tanzania', 'Uganda', 'India', 'Panama', 'Jamaica', 'Haiti',
  'El Salvador', 'Yemen'
];

export const roastLevels: RoastLevel[] = ['Light', 'Medium', 'Medium-Dark', 'Dark'];
export const processMethods: ProcessMethod[] = ['Washed', 'Natural', 'Honey', 'Anaerobic'];
export const coffeeTypes: CoffeeType[] = ['Single Origin', 'Blend', 'Espresso'];
export const sizeUnits: SizeUnit[] = ['g', 'oz'];
