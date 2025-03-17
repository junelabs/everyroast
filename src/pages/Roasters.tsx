
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoasterCard from '@/components/roasters/RoasterCard';
import { fetchRoasters } from '@/services/roasterService';
import { Skeleton } from '@/components/ui/skeleton';
import { Coffee, Search, MapPin, Filter, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoginPrompt from '@/components/LoginPrompt';
import { useAuth } from '@/context/auth';
import RoasterSubmissionDialog from '@/components/roasters/RoasterSubmissionDialog';

const Roasters = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState('Join our coffee community');
  const [promptDescription, setPromptDescription] = useState(
    'Create an account to access all roaster information and filtering features.'
  );
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch roasters data with optimized caching strategy
  const { data: roasters, isLoading, error } = useQuery({
    queryKey: ['roasters'],
    queryFn: fetchRoasters,
    staleTime: Infinity, // Data never goes stale automatically
    gcTime: 1000 * 60 * 60, // Cache for an hour (renamed from cacheTime)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Extract locations using useMemo to avoid unnecessary recalculations
  const locations = useMemo(() => {
    if (!roasters) return [];
    return [...new Set(roasters.filter(r => r.location).map(r => r.location as string))];
  }, [roasters]);

  // Memoize filtered roasters to avoid unnecessary filtering on each render
  const filteredRoasters = useMemo(() => {
    if (!roasters) return [];
    
    return roasters.filter(roaster => {
      const matchesSearch = searchTerm === '' || 
        roaster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (roaster.description && roaster.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLocation = selectedLocations.length === 0 || 
        (roaster.location && selectedLocations.includes(roaster.location));
      
      return matchesSearch && matchesLocation;
    });
  }, [roasters, searchTerm, selectedLocations]);

  // Memoize callback functions to prevent unnecessary re-renders
  const toggleLocation = useCallback((location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) ? prev.filter(loc => loc !== location) : [...prev, location]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedLocations([]);
  }, []);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSubmitRoasterClick = useCallback(() => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setShowSubmissionDialog(true);
  }, [user]);

  const closeLoginPrompt = useCallback(() => {
    setShowLoginPrompt(false);
  }, []);

  // Create loading skeletons for the grid - memoized to prevent recreation on each render
  const renderSkeletons = useCallback(() => {
    return Array(6).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="border rounded-lg p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="mt-6 flex justify-end">
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    ));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-roast-800 mb-4">Coffee Roasters</h1>
          <p className="text-lg text-black max-w-3xl">
            Discover exceptional coffee roasters from around the world. If you want to add a roaster to this list, click the button below to submit one!
          </p>
          <div className="mt-4">
            <Button 
              onClick={handleSubmitRoasterClick}
              className="bg-roast-500 hover:bg-roast-600 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Submit a Roaster
            </Button>
          </div>
        </div>
      </div>
      
      <main ref={contentRef} className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 pr-4 py-2 w-full"
                placeholder="Search roasters by name or description..."
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 mr-2">
                <Filter className="h-4 w-4 text-roast-500" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              
              {locations.slice(0, 5).map(location => (
                <Badge 
                  key={location}
                  variant={selectedLocations.includes(location) ? "default" : "outline"}
                  className={`cursor-pointer ${selectedLocations.includes(location) ? 'bg-roast-500' : ''}`}
                  onClick={() => toggleLocation(location)}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {location}
                </Badge>
              ))}
              
              {(searchTerm || selectedLocations.length > 0) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSkeletons()}
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="bg-rose-50 text-rose-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Coffee className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-medium mb-2">Error Loading Roasters</h3>
            <p className="text-gray-600 mb-6">
              We encountered a problem while loading the roasters. Please try again later.
            </p>
          </div>
        ) : filteredRoasters.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-500">
                Showing {filteredRoasters.length} {filteredRoasters.length === 1 ? 'roaster' : 'roasters'}
                {searchTerm && ` for "${searchTerm}"`}
                {selectedLocations.length > 0 && ' in selected locations'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoasters.map(roaster => (
                <RoasterCard key={roaster.id} roaster={roaster} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Coffee className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Roasters Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedLocations.length > 0 
                ? "No roasters match your current search or filter criteria. Try adjusting your filters."
                : "There are currently no coffee roasters in our database."}
            </p>
            <div className="flex justify-center gap-4">
              {(searchTerm || selectedLocations.length > 0) && (
                <Button onClick={clearFilters}>Clear Filters</Button>
              )}
              <Button 
                onClick={handleSubmitRoasterClick}
                className="bg-roast-500 hover:bg-roast-600 text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Submit a Roaster
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
      
      {/* Login prompt dialog */}
      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={closeLoginPrompt}
        message={promptMessage}
        description={promptDescription}
      />

      {/* Roaster submission dialog */}
      <RoasterSubmissionDialog 
        isOpen={showSubmissionDialog} 
        onOpenChange={setShowSubmissionDialog} 
      />
    </div>
  );
};

export default Roasters;
