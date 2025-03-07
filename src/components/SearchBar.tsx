
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
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
  );
};

export default SearchBar;
