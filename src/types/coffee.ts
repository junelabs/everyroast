
export type CoffeeOrigin = 'Ethiopia' | 'Colombia' | 'Brazil' | 'Guatemala' | 'Costa Rica' | 'Kenya' | 'Peru' | 'Indonesia' | 'Vietnam' | 'Honduras' | 'Mexico' | 'Rwanda' | 'Tanzania' | 'Uganda' | 'India' | 'Panama' | 'Jamaica' | 'Haiti' | 'El Salvador' | 'Yemen';
export type RoastLevel = 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
export type ProcessMethod = 'Washed' | 'Natural' | 'Honey' | 'Anaerobic';
export type CoffeeType = 'Single Origin' | 'Blend' | 'Espresso';
export type SizeUnit = 'g' | 'oz';

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
  coffeeType?: CoffeeType;
  size?: number;
  sizeUnit?: SizeUnit;
}
