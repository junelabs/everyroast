
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Coffee } from '@/types/coffee';

export function useCoffeeExplorer() {
  const [coffeeData, setCoffeeData] = useState<Coffee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCommunityCoffees();

    // Subscribe to real-time changes
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
          console.log('Coffee deletion detected:', payload);
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
        async (payload) => {
          console.log('New coffee detected:', payload);
          const newCoffee = payload.new;
          
          // Fetch additional data for the new coffee
          const { data: coffeeWithDetails } = await supabase
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
              roasters (name),
              reviews (rating)
            `)
            .eq('id', newCoffee.id)
            .is('deleted_at', null)
            .single();
            
          if (coffeeWithDetails) {
            // Get profile data for the coffee creator
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', coffeeWithDetails.created_by)
              .single();
              
            // Format the coffee data
            const reviews = coffeeWithDetails.reviews || [];
            const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
            
            const formattedCoffee: Coffee = {
              id: coffeeWithDetails.id,
              name: coffeeWithDetails.name,
              origin: coffeeWithDetails.origin || 'Unknown',
              roaster: coffeeWithDetails.roasters?.name || 'Unknown Roaster',
              image: coffeeWithDetails.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              rating: parseFloat(averageRating.toFixed(1)),
              price: coffeeWithDetails.price || 0,
              roastLevel: coffeeWithDetails.roast_level || 'Medium',
              processMethod: coffeeWithDetails.process_method || 'Washed',
              flavor: coffeeWithDetails.flavor_notes || 'No flavor notes provided',
              type: coffeeWithDetails.type || 'Single Origin',
              reviewCount: reviews.length,
              poster: {
                username: profileData?.username || 'anonymous',
                avatarUrl: profileData?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
                userId: coffeeWithDetails.created_by
              },
              upvotes: Math.floor(Math.random() * 100)
            };
            
            setCoffeeData(prevCoffees => [formattedCoffee, ...prevCoffees]);
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
        async (payload) => {
          console.log('Coffee update detected:', payload);
          
          if (payload.new.deleted_at) {
            // If coffee was soft-deleted, remove it from the list
            setCoffeeData(prevCoffees => 
              prevCoffees.filter(coffee => coffee.id !== payload.new.id)
            );
          } else {
            // If coffee was updated, fetch the updated data
            const { data: updatedCoffee } = await supabase
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
                roasters (name),
                reviews (rating)
              `)
              .eq('id', payload.new.id)
              .is('deleted_at', null)
              .single();
              
            if (updatedCoffee) {
              // Get profile data
              const { data: profileData } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', updatedCoffee.created_by)
                .single();
                
              // Format the coffee data
              const reviews = updatedCoffee.reviews || [];
              const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
              const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
              
              const formattedCoffee: Coffee = {
                id: updatedCoffee.id,
                name: updatedCoffee.name,
                origin: updatedCoffee.origin || 'Unknown',
                roaster: updatedCoffee.roasters?.name || 'Unknown Roaster',
                image: updatedCoffee.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                rating: parseFloat(averageRating.toFixed(1)),
                price: updatedCoffee.price || 0,
                roastLevel: updatedCoffee.roast_level || 'Medium',
                processMethod: updatedCoffee.process_method || 'Washed',
                flavor: updatedCoffee.flavor_notes || 'No flavor notes provided',
                type: updatedCoffee.type || 'Single Origin',
                reviewCount: reviews.length,
                poster: {
                  username: profileData?.username || 'anonymous',
                  avatarUrl: profileData?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
                  userId: updatedCoffee.created_by
                },
                upvotes: Math.floor(Math.random() * 100)
              };
              
              setCoffeeData(prevCoffees => {
                const index = prevCoffees.findIndex(c => c.id === formattedCoffee.id);
                if (index === -1) return prevCoffees;
                const newCoffees = [...prevCoffees];
                newCoffees[index] = formattedCoffee;
                return newCoffees;
              });
            }
          }
        }
      )
      .subscribe();
      
    return () => {
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

      const coffeeWithProfiles = await Promise.all(
        data.map(async (coffee) => {
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
  };

  return {
    coffeeData,
    isLoading,
    fetchCommunityCoffees
  };
}
