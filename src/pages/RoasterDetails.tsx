
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchRoasterById } from '@/services/roasterService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Globe, ArrowLeft } from 'lucide-react';
import { Coffee as CoffeeIcon } from 'lucide-react';

const RoasterDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: roaster, isLoading, error } = useQuery({
    queryKey: ['roaster', id],
    queryFn: () => id ? fetchRoasterById(id) : Promise.resolve(null),
    enabled: !!id,
  });

  useEffect(() => {
    document.title = roaster 
      ? `Every Roast | ${roaster.name}`
      : "Every Roast | Roaster Details";
  }, [roaster]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="mb-6">
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <Skeleton className="h-48 w-48 rounded-lg" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-10 w-60" />
                  <Skeleton className="h-6 w-40" />
                  <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !roaster) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <Link to="/roasters">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roasters
            </Button>
          </Link>
          
          <div className="py-12 text-center">
            <div className="bg-rose-50 text-rose-500 rounded-lg p-6 inline-block mb-4">
              <CoffeeIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2">Roaster Not Found</h3>
            <p className="text-gray-600 mb-6">
              The roaster you're looking for doesn't exist or there was an error loading the data.
            </p>
            <Button asChild>
              <Link to="/roasters">View All Roasters</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <Link to="/roasters">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roasters
          </Button>
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="h-48 w-48 flex items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
                {roaster.logo_url ? (
                  <img 
                    src={roaster.logo_url} 
                    alt={`${roaster.name} logo`} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <CoffeeIcon className="h-20 w-20 text-roast-400" />
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{roaster.name}</h1>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  {roaster.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2 text-roast-500" />
                      <span>{roaster.location}</span>
                    </div>
                  )}
                  
                  {roaster.website && (
                    <a 
                      href={roaster.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Globe className="h-5 w-5 mr-2" />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>
                
                <div className="mt-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">About</h2>
                  {roaster.description ? (
                    <p className="text-gray-600 whitespace-pre-line">{roaster.description}</p>
                  ) : (
                    <p className="text-gray-400 italic">No description available for this roaster.</p>
                  )}
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Coffee Offerings</h2>
                  <div className="bg-roast-50 p-4 rounded-lg inline-flex items-center">
                    <CoffeeIcon className="h-5 w-5 mr-2 text-roast-500" />
                    <span className="font-medium">{roaster.coffeeCount || 0} {(roaster.coffeeCount === 1) ? 'coffee' : 'coffees'} from this roaster</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RoasterDetails;
