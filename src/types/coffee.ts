
export interface Coffee {
  id: number | string;
  name: string;
  roaster: string;
  origin: string;
  image: string;
  rating: number;
  price: number;
  roastLevel: string;
  processMethod: string;
  flavor: string;
  reviewCount?: number;
  poster?: {
    username: string;
    avatarUrl: string;
    userId?: string;  // Make sure userId is included in the type definition
  };
  upvotes?: number;
  brewingMethod?: string;
  type?: string;
}

// Add additional type definitions needed by the form components
export type CoffeeOrigin = string;
export type RoastLevel = string;
export type ProcessMethod = string;
export type CoffeeType = string;
export type SizeUnit = string;
