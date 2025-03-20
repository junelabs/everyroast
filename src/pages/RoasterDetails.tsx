import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchRoasterById } from '@/services/roasterService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MapPin, 
  Globe, 
  Instagram, 
  ArrowLeft, 
  Coffee as CoffeeIcon,
  Info 
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';

const RoasterDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("about");
  
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/roasters">Roasters</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{roaster.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="h-48 w-48 flex items-center justify-center rounded-lg bg-roast-50 border border-roast-100 overflow-hidden">
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
                  
                  <div className="flex gap-3">
                    {roaster.website && (
                      <a 
                        href={roaster.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Globe className="h-5 w-5 mr-1" />
                        <span>Website</span>
                      </a>
                    )}
                    
                    {roaster.instagram && (
                      <a 
                        href={`https://instagram.com/${roaster.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-pink-600 hover:text-pink-800 transition-colors"
                      >
                        <Instagram className="h-5 w-5 mr-1" />
                        <span>Instagram</span>
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="bg-roast-50 text-roast-700 px-3 py-1.5 rounded-md text-sm font-medium flex items-center mt-6 w-fit">
                  <CoffeeIcon className="h-4 w-4 mr-2 text-roast-500" />
                  <span className="text-roast-900 font-bold mr-1">{roaster.coffeeCount || 0}</span> 
                  {(roaster.coffeeCount === 1) ? 'coffee' : 'coffees'} in the database
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="about" className="flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="coffees" className="flex items-center gap-1.5">
              <CoffeeIcon className="h-4 w-4" />
              Coffees ({roaster.coffeeCount || 0})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About {roaster.name}</h2>
              {roaster.description ? (
                <p className="text-gray-600 whitespace-pre-line">{roaster.description}</p>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    No description available for this roaster.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="coffees" className="space-y-8">
            {roaster.coffeeCount && roaster.coffeeCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Will be populated with real coffee data in a future PR */}
                {Array.from({ length: Math.min(roaster.coffeeCount, 6) }).map((_, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex gap-3">
                      <div className="h-16 w-16 bg-roast-100 rounded-md flex items-center justify-center">
                        <CoffeeIcon className="h-8 w-8 text-roast-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Coffee #{index + 1}</h3>
                        <p className="text-sm text-gray-500">
                          Example coffee from {roaster.name}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <CoffeeIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Coffees Found</h3>
                <p className="text-gray-600 mb-6">
                  There are currently no coffees from this roaster in our database.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-start mt-8 mb-4">
          <Button asChild variant="outline">
            <Link to="/roasters">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roasters
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RoasterDetails;
