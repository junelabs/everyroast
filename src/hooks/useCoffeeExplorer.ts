
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Coffee } from '@/types/coffee';

export function useCoffeeExplorer() {
  const [coffeeData, setCoffeeData] = useState<Coffee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Make fetchCommunityCoffees a useCallback to prevent infinite loops
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
        .is('deleted_at', null) // Only fetch non-deleted coffees
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (error) {
        console.error("Error fetching coffees:", error);
        throw error;
      }

      console.log("Raw coffee data from DB:", data);

      // Safety check to ensure we're only processing non-deleted coffees
      const filteredData = data.filter(coffee => coffee.deleted_at === null);
      console.log(`Filtered coffee data: ${filteredData.length} of ${data.length} coffees`);

      const coffeeWithProfiles = await Promise.all(
        filteredData.map(async (coffee) => {
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
              avatarUrl: profileData?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
              userId: coffee.created_by
            },
            upvotes: Math.floor(Math.random() * 100)
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
  }, [toast]);

  // Set up real-time listeners in a useEffect
  const setupRealtimeSubscription = useCallback(() => {
    console.log("Setting up realtime subscription for coffees");
    
    // Subscribe to real-time changes for reviews
    const reviewsChannel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        (payload) => {
          console.log('Review change detected:', payload);
          // For reviews, we need to refetch to get the updated average
          fetchCommunityCoffees();
        }
      )
      .subscribe();
    
    // Subscribe to real-time changes for coffees
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
          console.log('Coffee HARD deletion detected:', payload);
          // Remove deleted coffee from the state
          setCoffeeData(prevCoffees => 
            prevCoffees.filter(coffee => coffee.id !== payload.old.id)
          );
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
          console.log('New coffee detected:', payload);
          // Only add the coffee if it's not deleted
          if (!payload.new.deleted_at) {
            // Fetch fresh data to ensure we have all relationships
            fetchCommunityCoffees();
          } else {
            console.log('New coffee is already marked as deleted, ignoring:', payload.new.id);
          }
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
          console.log('Coffee update detected:', payload);
          
          // If the coffee was soft-deleted (deleted_at field is set), remove it from the list
          if (payload.new.deleted_at) {
            console.log('Coffee was soft-deleted, removing from list:', payload.new.id);
            setCoffeeData(prevCoffees => 
              prevCoffees.filter(coffee => coffee.id !== payload.new.id)
            );
          } else {
            // For non-delete updates, fetch all data to ensure consistency
            fetchCommunityCoffees();
          }
        }
      )
      .subscribe();
      
    // Return cleanup function to unsubscribe from channels
    return () => {
      console.log("Cleaning up realtime subscriptions");
      supabase.removeChannel(reviewsChannel);
      supabase.removeChannel(coffeesChannel);
    };
  }, [fetchCommunityCoffees]);

  return {
    coffeeData,
    isLoading,
    fetchCommunityCoffees,
    setupRealtimeSubscription
  };
}
