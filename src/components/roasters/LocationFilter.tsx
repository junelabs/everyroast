
import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LocationFilterProps {
  locations: string[];
  selectedLocations: string[];
  onSelectLocation: (location: string) => void;
  onClearLocations: () => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  locations,
  selectedLocations,
  onSelectLocation,
  onClearLocations
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  // Filter locations based on search term
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={filterRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 border-roast-200 hover:bg-roast-100"
      >
        <MapPin className="h-4 w-4 text-roast-500" />
        <span>Locations</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        {selectedLocations.length > 0 && (
          <Badge className="ml-1 bg-roast-500 hover:bg-roast-600">
            {selectedLocations.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 rounded-md bg-white p-3 shadow-lg border border-gray-200">
          <div className="mb-2">
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="mb-2"
            />
          </div>

          {selectedLocations.length > 0 && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-500">Selected</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClearLocations}
                  className="h-6 px-2 text-xs text-gray-500"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedLocations.map(location => (
                  <Badge
                    key={`selected-${location}`}
                    className="bg-roast-500 flex items-center gap-1 pl-2 pr-1 py-1"
                  >
                    {location}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => onSelectLocation(location)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto">
            {filteredLocations.length > 0 ? (
              <div className="space-y-1">
                {filteredLocations.map(location => (
                  <div
                    key={location}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 ${
                      selectedLocations.includes(location) ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => onSelectLocation(location)}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-2 text-roast-500" />
                      <span className="text-sm">{location}</span>
                    </div>
                    {selectedLocations.includes(location) && (
                      <Check className="h-4 w-4 text-roast-500" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2 text-gray-500 text-sm">
                No locations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationFilter;
