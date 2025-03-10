
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
          deleted_at,
          roasters (
            name
          ),
          reviews (
            rating
          )
        `)
        .is('deleted_at', null)  // This is critical - only get non-deleted coffees
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching coffees:", error);
        throw error;
      }

      console.log("Raw coffee data:", data);
      console.log("Number of coffees fetched:", data?.length || 0);
      
      const coffeeWithProfiles = await Promise.all(
        (data || []).map(async (coffee) => {
          if (coffee.deleted_at) {
            console.log(`Skipping deleted coffee: ${coffee.id}`);
            return null; // Skip deleted coffees
          }
          
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
          
          const coffeeItem: Coffee = {
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
          
          return coffeeItem;
        })
      );
      
      // Filter out any null values from the array (deleted coffees)
      const filteredCoffees = coffeeWithProfiles.filter(coffee => coffee !== null) as Coffee[];
      
      console.log("Filtered coffee data:", filteredCoffees);
      console.log("Number of coffees after filtering:", filteredCoffees.length);
      
      setCoffeeData(filteredCoffees);
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

  const setupRealtimeSubscription = useCallback(() => {
    console.log("Setting up realtime subscription for coffees");
    
    const channel = supabase
      .channel('coffee-changes')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'coffees'
        },
        (payload) => {
          console.log('Coffee hard deletion detected:', payload);
          setCoffeeData(prevCoffees => {
            console.log(`Removing coffee with ID ${payload.old.id} from state`);
            return prevCoffees.filter(coffee => coffee.id !== payload.old.id);
          });
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
          // Check if this is a soft delete update (deleted_at is being set)
          if (payload.new.deleted_at && !payload.old.deleted_at) {
            console.log('Coffee soft deletion detected:', payload);
            setCoffeeData(prevCoffees => {
              console.log(`Removing soft-deleted coffee with ID ${payload.new.id} from state`);
              return prevCoffees.filter(coffee => coffee.id !== payload.new.id);
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        () => {
          console.log('Review change detected, refreshing coffees');
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
