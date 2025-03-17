
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LocationFilter from './LocationFilter';

interface RoasterSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  locations: string[];
  selectedLocations: string[];
  toggleLocation: (location: string) => void;
  clearFilters: () => void;
}

const RoasterSearch: React.FC<RoasterSearchProps> = ({
  searchTerm,
  setSearchTerm,
  locations,
  selectedLocations,
  toggleLocation,
  clearFilters
}) => {
  const hasFilters = searchTerm || selectedLocations.length > 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 pr-4 py-2 w-full"
            placeholder="Search roasters by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="h-4 w-4 text-roast-500" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          
          <LocationFilter 
            locations={locations}
            selectedLocations={selectedLocations}
            onSelectLocation={toggleLocation}
            onClearLocations={clearFilters}
          />
          
          {hasFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs"
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoasterSearch;
