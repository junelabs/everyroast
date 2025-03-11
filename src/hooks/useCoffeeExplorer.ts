
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Coffee } from '@/types/coffee';
import { useAuth } from '@/context/auth';

export function useCoffeeExplorer() {
  const [coffeeData, setCoffeeData] = useState<Coffee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchUserCoffees = useCallback(async () => {
    if (!user) {
      console.log("No authenticated user, skipping coffee fetch");
      setIsLoading(false);
      setCoffeeData([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching user coffees...");
      
      const { data, error } = await supabase
        .from('coffees')
        .select(`
          *,
          roasters (name),
          reviews (rating)
        `)
        .eq('created_by', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("Raw coffee data:", data);
      
      // Filter out any null or undefined data
      const validCoffees = data?.filter(coffee => coffee && !coffee.deleted_at) || [];
      console.log("Valid coffees after filter:", validCoffees.length);

      const processedCoffees = validCoffees.map(coffee => {
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
            username: user?.email?.split('@')[0] || 'anonymous',
            avatarUrl: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
            userId: coffee.created_by
          },
          upvotes: Math.floor(Math.random() * 100)
        };
      });
      
      console.log("Final processed coffees:", processedCoffees.length);
      setCoffeeData(processedCoffees);
    } catch (error) {
      console.error("Error in fetchUserCoffees:", error);
      toast({
        title: "Error loading coffees",
        description: "Could not load your coffees. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  const setupRealtimeSubscription = useCallback(() => {
    if (!user) {
      console.log("No authenticated user, skipping realtime subscription");
      return () => {};
    }

    console.log("Setting up realtime subscription for user coffees");
    
    const channel = supabase
      .channel('user-coffee-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coffees',
          filter: `created_by=eq.${user.id}`
        },
        (payload) => {
          console.log('Coffee change detected:', payload);
          // Refresh the entire list when any coffee change is detected
          fetchUserCoffees();
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
      });

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [fetchUserCoffees, user]);

  return {
    coffeeData,
    isLoading,
    fetchUserCoffees,
    setupRealtimeSubscription
  };
}
