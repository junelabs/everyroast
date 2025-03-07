
export type CoffeeOrigin = 'Ethiopia' | 'Colombia' | 'Brazil' | 'Guatemala' | 'Costa Rica' | 'Kenya';
export type RoastLevel = 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
export type ProcessMethod = 'Washed' | 'Natural' | 'Honey' | 'Anaerobic';

export interface Coffee {
  id: number;
  name: string;
  origin: CoffeeOrigin;
  roaster: string;
  image: string;
  rating: number;
  price: number;
  roastLevel: RoastLevel;
  processMethod: ProcessMethod;
  flavor: string;
}
