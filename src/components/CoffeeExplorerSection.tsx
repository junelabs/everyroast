
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CoffeeCard from '@/components/CoffeeCard';
import FilterTabs from '@/components/FilterTabs';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CoffeeExplorerSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCoffees, setVisibleCoffees] = useState(4);
  const [coffeeData, setCoffeeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Initial fetch
    fetchCommunityCoffees();

    // Set up real-time subscription for reviews changes
    const reviewsChannel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'reviews'
        },
        (payload) => {
          console.log('Review deleted:', payload);
          // When a review is deleted, refresh the coffee list
          fetchCommunityCoffees();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews'
        },
        (payload) => {
          console.log('Review added:', payload);
          // When a review is added, refresh the coffee list
          fetchCommunityCoffees();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reviews'
        },
        (payload) => {
          console.log('Review updated:', payload);
          // When a review is updated, refresh the coffee list
          fetchCommunityCoffees();
        }
      )
      .subscribe();
    
    // Set up real-time subscription for coffee deletions
    const coffeesChannel = supabase
      .channel('coffees-changes')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'coffees'
        },
        (payload) => {
          console.log('Coffee deleted:', payload);
          // When a coffee is deleted, refresh the coffee list
          fetchCommunityCoffees();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coffees'
        },
        (payload) => {
          console.log('Coffee added:', payload);
          // When a coffee is added, refresh the coffee list
          fetchCommunityCoffees();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'coffees'
        },
        (payload) => {
          console.log('Coffee updated:', payload);
          // When a coffee is updated, refresh the coffee list
          fetchCommunityCoffees();
        }
      )
      .subscribe();
      
    return () => {
      // Clean up subscriptions on component unmount
      supabase.removeChannel(reviewsChannel);
      supabase.removeChannel(coffeesChannel);
    };
  }, []);

  const fetchCommunityCoffees = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching community coffees...");
      
      const { data, error } = await supabase
        .from('coffees')
        .select(`
          id,
          name,
          origin,
          roast_level,
          process_method,
          price,
          image_url,
          flavor_notes,
          created_by,
          type,
          roasters (
            name
          ),
          reviews (
            rating
          )
        `)
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (error) {
        console.error("Error fetching coffees:", error);
        throw error;
      }

      // Log the raw data to see what we're working with
      console.log("Raw coffee data:", data);

      // Fetch profile information for each coffee's creator
      const coffeeWithProfiles = await Promise.all(
        data.map(async (coffee) => {
          // Get profile data for the creator
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', coffee.created_by)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }

          const reviews = coffee.reviews || [];
          const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
          const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
          
          return {
            id: coffee.id,
            name: coffee.name,
            origin: coffee.origin || 'Unknown',
            roaster: coffee.roasters?.name || 'Unknown Roaster',
            image: coffee.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            rating: parseFloat(averageRating.toFixed(1)),
            price: coffee.price || 0,
            roastLevel: coffee.roast_level || 'Medium',
            processMethod: coffee.process_method || 'Washed',
            flavor: coffee.flavor_notes || 'No flavor notes provided',
            type: coffee.type || 'Single Origin',
            reviewCount: reviews.length,
            poster: {
              username: profileData?.username || 'anonymous',
              avatarUrl: profileData?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
            },
            upvotes: Math.floor(Math.random() * 100) // Temporary random number for demonstration
          };
        })
      );
      
      console.log("Processed coffee data:", coffeeWithProfiles);
      setCoffeeData(coffeeWithProfiles);
    } catch (error) {
      console.error("Error in fetchCommunityCoffees:", error);
      toast({
        title: "Error loading coffees",
        description: "Could not load community coffees. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLoadMore = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view more coffees.",
        variant: "default"
      });
      navigate('/login');
      return;
    }
    
    setVisibleCoffees(prev => prev + 4);
  };
  
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-roast-800 mb-6 pl-0">Community Coffee Reviews</h2>
        
        <FilterTabs />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : coffeeData.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No community reviews yet. Be the first to add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coffeeData.slice(0, visibleCoffees).map((coffee) => (
              <CoffeeCard key={coffee.id} coffee={coffee} />
            ))}
          </div>
        )}
        
        {coffeeData.length > visibleCoffees && (
          <div className="mt-12 text-center">
            <Button 
              className={`rounded-full px-8 py-4 border border-roast-300 ${!user ? 'bg-roast-500 text-white hover:bg-roast-600' : 'text-roast-800 hover:bg-roast-100'} text-lg font-medium`}
              onClick={handleLoadMore}
            >
              {user ? 'Load More Coffees' : 'Sign In to See More'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoffeeExplorerSection;
