
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoasterCard from '@/components/roasters/RoasterCard';
import { fetchRoasters } from '@/services/roasterService';
import { Skeleton } from '@/components/ui/skeleton';
import { Coffee } from 'lucide-react';

const Roasters = () => {
  const { data: roasters, isLoading, error } = useQuery({
    queryKey: ['roasters'],
    queryFn: fetchRoasters,
  });

  // Create loading skeletons for the grid
  const renderSkeletons = () => {
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coffee Roasters</h1>
          <p className="text-gray-600 max-w-2xl">
            Discover exceptional coffee roasters from around the world. Each with their own unique story and approach to the craft of roasting.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSkeletons()}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="bg-rose-50 text-rose-500 rounded-lg p-6 inline-block mb-4">
              <Coffee className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2">Error Loading Roasters</h3>
            <p className="text-gray-600 mb-6">
              We encountered a problem while loading the roasters. Please try again later.
            </p>
          </div>
        ) : roasters && roasters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roasters.map(roaster => (
              <RoasterCard key={roaster.id} roaster={roaster} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="bg-gray-100 rounded-lg p-6 inline-block mb-4">
              <Coffee className="h-12 w-12 mx-auto text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Roasters Found</h3>
            <p className="text-gray-600">
              There are currently no coffee roasters in our database.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Roasters;
