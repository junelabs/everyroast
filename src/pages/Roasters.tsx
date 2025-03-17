import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoasterCard from '@/components/roasters/RoasterCard';
import RoasterSearch from '@/components/roasters/RoasterSearch';
import { fetchRoasters } from '@/services/roasterService';
import { Skeleton } from '@/components/ui/skeleton';
import { Coffee, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import RoasterSubmissionDialog from '@/components/roasters/RoasterSubmissionDialog';

const Roasters = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
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
    return [...new Set(roasters.filter(r => r.location).map(r => r.location as string))].sort();
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

  const handleSubmitRoasterClick = useCallback(() => {
    setShowSubmissionDialog(true);
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
        <RoasterSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          locations={locations}
          selectedLocations={selectedLocations}
          toggleLocation={toggleLocation}
          clearFilters={clearFilters}
        />
        
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
                {selectedLocations.length > 0 && ` in ${selectedLocations.length === 1 ? 'selected location' : 'selected locations'}`}
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
      
      {/* Roaster submission dialog */}
      <RoasterSubmissionDialog 
        isOpen={showSubmissionDialog} 
        onOpenChange={setShowSubmissionDialog} 
      />
    </div>
  );
};

export default Roasters;
