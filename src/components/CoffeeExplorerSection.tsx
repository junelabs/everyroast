
import { useState } from 'react';
import { Search, Coffee, Filter, LayoutGrid, ChevronDown, Star, ThermometerSun, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type CoffeeOrigin = 'Ethiopia' | 'Colombia' | 'Brazil' | 'Guatemala' | 'Costa Rica' | 'Kenya';
type RoastLevel = 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
type ProcessMethod = 'Washed' | 'Natural' | 'Honey' | 'Anaerobic';

interface CoffeeCardProps {
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

const coffeeData: CoffeeCardProps[] = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    origin: "Ethiopia",
    roaster: "Stumptown Coffee",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    price: 18.50,
    roastLevel: "Light",
    processMethod: "Washed",
    flavor: "Floral, Citrus, Bergamot"
  },
  {
    id: 2,
    name: "Colombian Supremo",
    origin: "Colombia",
    roaster: "Blue Bottle Coffee",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    price: 16.95,
    roastLevel: "Medium",
    processMethod: "Washed",
    flavor: "Caramel, Nutty, Chocolate"
  },
  {
    id: 3,
    name: "Brazil Cerrado",
    origin: "Brazil",
    roaster: "Intelligentsia",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.2,
    price: 15.75,
    roastLevel: "Medium-Dark",
    processMethod: "Natural",
    flavor: "Chocolate, Nuts, Caramel"
  },
  {
    id: 4,
    name: "Guatemalan Antigua",
    origin: "Guatemala",
    roaster: "Counter Culture",
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    price: 19.25,
    roastLevel: "Medium",
    processMethod: "Washed",
    flavor: "Spicy, Chocolatey, Floral"
  },
  {
    id: 5,
    name: "Costa Rica Tarrazu",
    origin: "Costa Rica",
    roaster: "Verve Coffee",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.4,
    price: 17.50,
    roastLevel: "Medium",
    processMethod: "Honey",
    flavor: "Honey, Citrus, Brown Sugar"
  },
  {
    id: 6,
    name: "Kenya AA",
    origin: "Kenya",
    roaster: "Heart Coffee",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    price: 21.00,
    roastLevel: "Medium",
    processMethod: "Washed",
    flavor: "Black Currant, Tomato, Citrus"
  },
];

const CoffeeCard = ({ coffee }: { coffee: CoffeeCardProps }) => {
  const getRoastLevelEmoji = (level: RoastLevel) => {
    switch (level) {
      case 'Light': return '☀️';
      case 'Medium': return '🌤️';
      case 'Medium-Dark': return '⛅';
      case 'Dark': return '☁️';
      default: return '☀️';
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-md group transition-all hover:shadow-xl">
      <div className="h-[400px] relative">
        <img 
          src={coffee.image} 
          alt={coffee.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Top indicators */}
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-medium">
          <span className="text-lg">{coffee.id}</span>
        </div>
        
        {/* Wi-Fi speed equivalent for coffee rating */}
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-lg font-medium">{coffee.rating}</span>
        </div>
        
        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 text-white p-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-20">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-2xl font-bold">{coffee.name}</h3>
              <div className="flex items-center text-gray-300">
                <Coffee className="h-4 w-4 mr-1" />
                <span>{coffee.roaster}</span>
              </div>
            </div>
            <div className="flex items-end flex-col">
              <div className="text-2xl font-bold text-white">
                ${coffee.price.toFixed(2)}
              </div>
              <div className="text-xs text-gray-300">/lb</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20">
            <div className="flex items-center">
              <span className="text-lg mr-1">{getRoastLevelEmoji(coffee.roastLevel)}</span>
              <div className="text-sm">{coffee.roastLevel}</div>
            </div>
            
            <div className="flex items-center">
              <ThermometerSun className="h-4 w-4 mr-1 text-gray-300" />
              <div className="text-sm">{coffee.processMethod}</div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-300" />
              <div className="text-sm truncate">{coffee.origin}</div>
            </div>
          </div>
          
          <Button 
            className="w-full mt-3 bg-roast-500 hover:bg-roast-600 text-white"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

const CoffeeExplorerSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <section className="py-20 bg-roast-50/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-roast-800 mb-4">Explore Premium Coffee Beans</h2>
          <p className="text-xl text-roast-600 max-w-2xl mx-auto">
            Discover and compare the finest coffee beans from around the world, with detailed tasting notes and roaster information.
          </p>
        </div>
        
        {/* Filters and search row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="outline" className="rounded-full border-roast-200 text-roast-800 hover:bg-roast-100">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search or filter"
                className="pl-10 pr-4 py-2 rounded-full border-roast-200 focus-visible:ring-roast-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-roast-500 hover:bg-roast-600">
                <Search className="h-3.5 w-3.5 text-white" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4 ml-auto">
            <Button variant="outline" className="rounded-full border-roast-200 text-roast-800 hover:bg-roast-100">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Grid view
            </Button>
            
            <Button variant="outline" className="rounded-full border-roast-200 text-roast-800 hover:bg-roast-100">
              Sort by
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Horizontal tabs/filter */}
        <div className="mb-8 border-b border-roast-200">
          <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide">
            <div className="text-roast-800 font-medium whitespace-nowrap border-b-2 border-roast-500 pb-4 -mb-4">Popular</div>
            <div className="text-roast-500 whitespace-nowrap">Light Roast</div>
            <div className="text-roast-500 whitespace-nowrap">Medium Roast</div>
            <div className="text-roast-500 whitespace-nowrap">Dark Roast</div>
            <div className="text-roast-500 whitespace-nowrap">Single Origin</div>
            <div className="text-roast-500 whitespace-nowrap">Blends</div>
            <div className="text-roast-500 whitespace-nowrap">Espresso</div>
            <div className="text-roast-500 whitespace-nowrap">Decaf</div>
          </div>
        </div>
        
        {/* Coffee cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coffeeData.map((coffee) => (
            <CoffeeCard key={coffee.id} coffee={coffee} />
          ))}
        </div>
        
        {/* Load more button */}
        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            className="rounded-full px-8 py-6 border-roast-300 text-roast-800 hover:bg-roast-100 text-lg font-medium"
          >
            Load More Coffees
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoffeeExplorerSection;
