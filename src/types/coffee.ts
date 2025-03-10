
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
  };
  upvotes?: number;
}
