
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, HelpCircle, Coffee } from "lucide-react";
import { CoffeeOrigin, CoffeeType } from "@/types/coffee";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface CoffeeBasicDetailsProps {
  coffeeName: string;
  setCoffeeName: (name: string) => void;
  roaster: string;
  setRoaster: (roaster: string) => void;
  origin: CoffeeOrigin;
  setOrigin: (origin: CoffeeOrigin) => void;
  coffeeType: CoffeeType;
  setCoffeeType: (type: CoffeeType) => void;
  origins: CoffeeOrigin[];
  coffeeTypes: CoffeeType[];
  readOnly?: boolean;
  showValidationErrors?: boolean;
  showHelpText?: boolean;
}

interface RoasterOption {
  value: string;
  label: string;
}

interface CoffeeOption {
  value: string;
  label: string;
  roasterName?: string;
}

const CoffeeBasicDetails = ({
  coffeeName,
  setCoffeeName,
  roaster,
  setRoaster,
  origin,
  setOrigin,
  coffeeType,
  setCoffeeType,
  origins,
  coffeeTypes,
  readOnly = false,
  showValidationErrors = false,
  showHelpText = false
}: CoffeeBasicDetailsProps) => {
  const [roasterOpen, setRoasterOpen] = useState(false);
  const [coffeeOpen, setCoffeeOpen] = useState(false);
  const [roasters, setRoasters] = useState<RoasterOption[]>([]);
  const [coffees, setCoffees] = useState<CoffeeOption[]>([]);
  const [filteredCoffees, setFilteredCoffees] = useState<CoffeeOption[]>([]);
  const [isRoastersLoading, setIsRoastersLoading] = useState(false);
  const [isCoffeesLoading, setIsCoffeesLoading] = useState(false);
  
  const isNameEmpty = showValidationErrors && coffeeName.trim().length === 0;
  const isRoasterEmpty = showValidationErrors && roaster.trim().length === 0;

  // Fetch roasters from Supabase
  useEffect(() => {
    const fetchRoasters = async () => {
      setIsRoastersLoading(true);
      try {
        const { data, error } = await supabase
          .from('roasters')
          .select('id, name')
          .order('name', { ascending: true })
          .limit(50);
        
        if (error) {
          console.error('Error fetching roasters:', error);
          setRoasters([]);
          return;
        }
        
        const formattedRoasters = (data || []).map(r => ({
          value: r.name,
          label: r.name
        }));
        
        setRoasters(formattedRoasters);
      } catch (err) {
        console.error('Unexpected error fetching roasters:', err);
        setRoasters([]);
      } finally {
        setIsRoastersLoading(false);
      }
    };
    
    fetchRoasters();
  }, []);
  
  // Fetch coffees from Supabase
  useEffect(() => {
    const fetchCoffees = async () => {
      setIsCoffeesLoading(true);
      try {
        const { data, error } = await supabase
          .from('coffees')
          .select(`
            id, name, roaster:roasters(name)
          `)
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (error) {
          console.error('Error fetching coffees:', error);
          setCoffees([]);
          setFilteredCoffees([]);
          return;
        }
        
        const formattedCoffees = (data || []).map(c => ({
          value: c.name,
          label: c.name,
          roasterName: c.roaster?.name || 'Unknown Roaster'
        }));
        
        setCoffees(formattedCoffees);
        setFilteredCoffees(formattedCoffees); // Initialize filtered coffees with all coffees
      } catch (err) {
        console.error('Unexpected error fetching coffees:', err);
        setCoffees([]);
        setFilteredCoffees([]);
      } finally {
        setIsCoffeesLoading(false);
      }
    };
    
    fetchCoffees();
  }, []);
  
  // Filter coffees based on selected roaster
  useEffect(() => {
    if (roaster && coffees.length > 0) {
      const filtered = coffees.filter(c => 
        c.roasterName?.toLowerCase() === roaster.toLowerCase()
      );
      setFilteredCoffees(filtered.length > 0 ? filtered : []);
    } else {
      setFilteredCoffees(coffees || []);
    }
  }, [roaster, coffees]);

  // Safe filter function to handle potential null/undefined values
  const safeFilter = <T extends RoasterOption | CoffeeOption>(options: T[] | null | undefined, searchTerm: string): T[] => {
    if (!options || !Array.isArray(options) || options.length === 0) return [];
    if (!searchTerm) return options;
    
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Ensure we always have valid arrays for our CommandGroup components
  const filteredRoasters = safeFilter<RoasterOption>(roasters, roaster || '');
  const filteredCoffeeOptions = safeFilter<CoffeeOption>(filteredCoffees, coffeeName || '');

  return (
    <>
      {/* Roaster Autocomplete */}
      <div className="space-y-2">
        <label htmlFor="roaster" className="block text-sm font-medium">
          Roaster *
        </label>
        
        <Popover 
          open={roasterOpen} 
          onOpenChange={setRoasterOpen}
        >
          <PopoverTrigger asChild>
            <div className="flex w-full items-center relative">
              <Input
                id="roaster"
                placeholder="e.g., Stumptown Coffee"
                value={roaster || ''}
                onChange={(e) => setRoaster(e.target.value)}
                required
                readOnly={readOnly}
                className={`${readOnly ? "bg-gray-100" : ""} ${isRoasterEmpty ? "border-red-400 bg-red-50" : ""}`}
                onClick={() => !readOnly && setRoasterOpen(true)}
              />
              <Coffee className="absolute right-3 h-4 w-4 text-gray-400" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]" align="start">
            <Command>
              <CommandInput placeholder="Search roasters..." />
              <CommandEmpty>No roaster found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {isRoastersLoading ? (
                  <div className="py-6 text-center text-sm text-gray-500">Loading roasters...</div>
                ) : (
                  filteredRoasters.map((r) => (
                    <CommandItem
                      key={r.value}
                      value={r.value}
                      onSelect={(currentValue) => {
                        setRoaster(currentValue);
                        setRoasterOpen(false);
                      }}
                    >
                      {r.label}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        {isRoasterEmpty && (
          <p className="text-sm text-red-500 mt-1">Roaster name is required</p>
        )}
      </div>
      
      {/* Coffee Name Autocomplete */}
      <div className="space-y-2">
        <label htmlFor="coffeeName" className="block text-sm font-medium">
          Coffee Name *
        </label>
        
        <Popover 
          open={coffeeOpen} 
          onOpenChange={setCoffeeOpen}
        >
          <PopoverTrigger asChild>
            <div className="flex w-full items-center relative">
              <Input
                id="coffeeName"
                placeholder="e.g., Ethiopian Yirgacheffe"
                value={coffeeName || ''}
                onChange={(e) => setCoffeeName(e.target.value)}
                required
                readOnly={readOnly}
                className={`${readOnly ? "bg-gray-100" : ""} ${isNameEmpty ? "border-red-400 bg-red-50" : ""}`}
                onClick={() => !readOnly && setCoffeeOpen(true)}
              />
              <Coffee className="absolute right-3 h-4 w-4 text-gray-400" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]" align="start">
            <Command>
              <CommandInput placeholder="Search coffees..." />
              <CommandEmpty>No coffee found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {isCoffeesLoading ? (
                  <div className="py-6 text-center text-sm text-gray-500">Loading coffees...</div>
                ) : (
                  filteredCoffeeOptions.length > 0 ? 
                    filteredCoffeeOptions.map((c) => (
                      <CommandItem
                        key={c.value}
                        value={c.value}
                        onSelect={(currentValue) => {
                          setCoffeeName(currentValue);
                          setCoffeeOpen(false);
                        }}
                      >
                        <div className="flex flex-col">
                          <span>{c.label}</span>
                          <span className="text-xs text-gray-500">{c.roasterName}</span>
                        </div>
                      </CommandItem>
                    ))
                  : <div className="py-6 text-center text-sm text-gray-500">No coffees found</div>
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        {isNameEmpty && (
          <p className="text-sm text-red-500 mt-1">Coffee name is required</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="origin" className="block text-sm font-medium flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-500" />
            Origin
            {showHelpText && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-gray-400 ml-1 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-[200px]">Not sure? Just make your best guess or leave as default</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </label>
          <Select 
            value={origin} 
            onValueChange={(value: CoffeeOrigin) => setOrigin(value)}
            disabled={readOnly}
          >
            <SelectTrigger className={readOnly ? "bg-gray-100" : ""}>
              <SelectValue placeholder="Select origin" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {origins && origins.map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="coffeeType" className="block text-sm font-medium">
            Type
          </label>
          <Select 
            value={coffeeType} 
            onValueChange={(value: CoffeeType) => setCoffeeType(value)}
            disabled={readOnly}
          >
            <SelectTrigger className={readOnly ? "bg-gray-100" : ""}>
              <SelectValue placeholder="Select coffee type" />
            </SelectTrigger>
            <SelectContent>
              {coffeeTypes && coffeeTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default CoffeeBasicDetails;
