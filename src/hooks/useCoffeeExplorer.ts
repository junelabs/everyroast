import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Coffee } from '@/types/coffee';

export function useCoffeeExplorer() {
  const [coffeeData, setCoffeeData] = useState<Coffee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCommunityCoffees = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Fetching community coffees...");
      
      // Explicitly check for non-deleted coffees in the query
      const { data, error } = await supabase
        .from('coffees')
        .select(`
          *,
          roasters (name),
          reviews (rating)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("Raw coffee data:", data);
      
      // Filter out any null or undefined data
      const validCoffees = data?.filter(coffee => coffee && !coffee.deleted_at) || [];
      console.log("Valid coffees after filter:", validCoffees.length);

      const coffeeWithProfiles = await Promise.all(
        validCoffees.map(async (coffee) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', coffee.created_by)
            .single();

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
              avatarUrl: profileData?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
              userId: coffee.created_by
            },
            upvotes: Math.floor(Math.random() * 100)
          };
        })
      );
      
      console.log("Final processed coffees:", coffeeWithProfiles.length);
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
  }, [toast]);

  // Keeping the setupRealtimeSubscription function but modifying it to avoid triggering roaster updates
  const setupRealtimeSubscription = useCallback(() => {
    console.log("Setting up realtime subscription for coffees");
    
    const channel = supabase
      .channel('coffee-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'coffees',
          filter: 'deleted_at=is.null'
        },
        (payload) => {
          console.log('Coffee update detected:', payload);
          // Only update the coffee data, don't refresh roasters
          fetchCommunityCoffees();
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
      });

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [fetchCommunityCoffees]);

  return {
    coffeeData,
    isLoading,
    fetchCommunityCoffees,
    setupRealtimeSubscription
  };
}
