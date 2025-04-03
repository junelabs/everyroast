import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoffeeGrid from '@/components/coffee/CoffeeGrid';
import { fetchRoasterById, fetchRoasterCoffees } from '@/services/roasterService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MapPin, 
  Globe, 
  Instagram, 
  ArrowLeft, 
  Coffee as CoffeeIcon,
  BookOpen,
  PlusCircle
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
import { useAuth } from '@/context/auth';
import { useToast } from '@/components/ui/use-toast';
import CoffeeSubmissionDialog from '@/components/roasters/coffee/CoffeeSubmissionDialog';

const getLogoUrl = (roaster) => {
  if (roaster.logo_url) return roaster.logo_url;

  try {
    if (!roaster.website) return null;
    const domain = new URL(roaster.website).hostname.replace(/^www\./, '');
    return `https://logo.clearbit.com/${domain}`;
  } catch {
    return null;
  }
};

const RoasterDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("coffees");
  const [visibleCoffees, setVisibleCoffees] = useState(6);
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCoffeeDialog, setShowCoffeeDialog] = useState(false);
  
  const { data: roaster, isLoading: isRoasterLoading, error: roasterError } = useQuery({
    queryKey: ['roaster', id],
    queryFn: () => id ? fetchRoasterById(id) : Promise.resolve(null),
    enabled: !!id,
  });

  const { data: coffees = [], isLoading: isCoffeesLoading } = useQuery({
    queryKey: ['roasterCoffees', id],
    queryFn: () => id ? fetchRoasterCoffees(id) : Promise.resolve([]),
    enabled: !!id,
  });

  // Add roaster name to coffee objects
  const enrichedCoffees = React.useMemo(() => {
    if (!roaster) return [];
    return coffees.map(coffee => ({
      ...coffee,
      roaster: roaster.name
    }));
  }, [coffees, roaster]);

  useEffect(() => {
    document.title = roaster 
      ? `Every Roast | ${roaster.name}`
      : "Every Roast | Roaster Details";
  }, [roaster]);

  const handleLoadMore = () => {
    setVisibleCoffees(prev => prev + 6);
  };

  const handleAddCoffee = () => {
    // Admin check happens in the modal itself now
    setShowCoffeeDialog(true);
  };

  const handleCoffeeAdded = () => {
    // Refresh the coffees list
    if (id) {
      // Invalidate the roasterCoffees query to refetch the data
      toast({
        title: "Coffee Added",
        description: "The coffee has been added to this roaster's catalog.",
        variant: "default"
      });
    }
  };

  if (isRoasterLoading) {
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

  if (roasterError || !roaster) {
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
                {getLogoUrl(roaster) ? (
                  <img
                    src={getLogoUrl(roaster)}
                    alt={`${roaster.name} logo`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/default-logo.png'; // fallback image
                    }}
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
                
                {/* About section with no grey background */}
                {roaster.description && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">About {roaster.name}</h2>
                    <p className="text-gray-600 whitespace-pre-line">{roaster.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="coffees" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="coffees" className="flex items-center gap-1.5">
              <CoffeeIcon className="h-4 w-4" />
              Coffees
            </TabsTrigger>
            <TabsTrigger value="brew-guides" className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Brew Guides
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="coffees" className="space-y-8">
            {/* Admin/Owner controls for adding coffees */}
            {user && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddCoffee} 
                  className="bg-roast-500 hover:bg-roast-600 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Coffee (Admin)
                </Button>
              </div>
            )}
            
            {!isCoffeesLoading && enrichedCoffees.length > 0 ? (
              <>
                <CoffeeGrid 
                  coffees={enrichedCoffees} 
                  isLoading={isCoffeesLoading} 
                  visibleCount={visibleCoffees} 
                />
                
                {enrichedCoffees.length > visibleCoffees && (
                  <div className="flex justify-center mt-8">
                    <Button onClick={handleLoadMore} variant="outline" className="w-full max-w-md">
                      Load More Coffees
                    </Button>
                  </div>
                )}
              </>
            ) : !isCoffeesLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <CoffeeIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Coffees Found</h3>
                <p className="text-gray-600 mb-6">
                  There are currently no official coffees from this roaster in our database.
                </p>
                {user && (
                  <Button 
                    onClick={handleAddCoffee}
                    className="bg-roast-500 hover:bg-roast-600 text-white"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add First Coffee
                  </Button>
                )}
              </div>
            ) : (
              <CoffeeGrid 
                coffees={[]} 
                isLoading={isCoffeesLoading} 
                visibleCount={visibleCoffees} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="brew-guides" className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Brew Guides Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                Brewing guides for this roaster will be available soon.
              </p>
            </div>
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
      
      {/* Coffee submission dialog */}
      {id && (
        <CoffeeSubmissionDialog 
          isOpen={showCoffeeDialog} 
          onOpenChange={setShowCoffeeDialog} 
          roasterId={id}
          onSuccess={handleCoffeeAdded}
        />
      )}
    </div>
  );
};

export default RoasterDetails;
