
import { useAuth } from "@/context/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Coffee, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentCoffeesSelectorProps {
  reviewCount: number;
  onSelectCoffee: (id: string) => void;
  onAddNewCoffee: () => void;
  onClose: () => void;
}

const RecentCoffeesSelector = ({
  reviewCount,
  onSelectCoffee,
  onAddNewCoffee,
  onClose
}: RecentCoffeesSelectorProps) => {
  const { user } = useAuth();
  
  // Calculate the limit based on review count
  const recentCoffeeLimit = reviewCount < 4 ? reviewCount : 4;
  console.log(`Setting recent coffee limit to: ${recentCoffeeLimit}`);
  
  // Helper function to check if an image URL is a placeholder
  const isPlaceholderImage = (url: string | null): boolean => {
    if (!url) return true;
    
    return url.includes('placeholder') || 
           url.includes('unsplash') || 
           url.includes('gravatar');
  };
  
  // Fetch recent coffees
  const { data: recentCoffees = [], isLoading: isLoadingRecentCoffees } = useQuery({
    queryKey: ['recentCoffees', user?.id, recentCoffeeLimit],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log(`Fetching up to ${recentCoffeeLimit} recent coffees, excluding deleted ones`);
      
      // If user has no reviews, return empty array to avoid unnecessary query
      if (reviewCount === 0) {
        console.log("User has no reviews, skipping recent coffees fetch");
        return [];
      }
      
      // Get unique coffee IDs from the most recent reviews
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .select('coffee_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(recentCoffeeLimit);
        
      if (reviewError) {
        console.error("Error fetching recent review coffee IDs:", reviewError);
        return [];
      }
      
      // If no reviews, return empty array
      if (!reviewData || reviewData.length === 0) {
        return [];
      }
      
      // Get unique coffee IDs, preserving order
      const uniqueCoffeeIds = [...new Set(reviewData.map(r => r.coffee_id))];
      console.log("Unique coffee IDs from recent reviews:", uniqueCoffeeIds);
      
      // Fetch coffee details for these IDs, only non-deleted coffees
      const { data, error } = await supabase
        .from('coffees')
        .select(`
          id,
          name, 
          image_url,
          deleted_at,
          roasters (name)
        `)
        .in('id', uniqueCoffeeIds)
        .is('deleted_at', null) // Filter out deleted coffees
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching recent coffees:", error);
        throw error;
      }
      
      console.log("Fetched coffees:", data);
      
      // Additional client-side filter to ensure no deleted coffees
      // and filter out coffees with placeholder images
      const validCoffees = data?.filter(coffee => 
        !coffee.deleted_at && 
        !isPlaceholderImage(coffee.image_url)
      ) || [];
      
      console.log("Valid coffees after filtering:", validCoffees.length);
      
      // Sort the valid coffees to match the original review order
      const sortedCoffees = validCoffees.sort((a, b) => {
        const aIndex = uniqueCoffeeIds.indexOf(a.id);
        const bIndex = uniqueCoffeeIds.indexOf(b.id);
        return aIndex - bIndex;
      });
      
      return sortedCoffees.slice(0, recentCoffeeLimit);
    },
    enabled: !!user?.id && reviewCount > 0,
    staleTime: 0, // Force fresh data every time
    refetchOnMount: true // Always refetch when component mounts
  });

  return (
    <div className="space-y-6 pt-4">
      <h3 className="font-medium text-xl">Recent Coffees</h3>
      
      <div className="space-y-0 rounded-lg border overflow-hidden">
        {isLoadingRecentCoffees ? (
          Array(Math.min(4, reviewCount || 1)).fill(0).map((_, i) => (
            <div key={i} className="h-20 animate-pulse bg-gray-100 border-b last:border-b-0"></div>
          ))
        ) : recentCoffees.length > 0 ? (
          recentCoffees.map((coffee: any) => (
            <div 
              key={coffee.id}
              className="border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onSelectCoffee(coffee.id)}
            >
              <div className="flex items-center p-4">
                <div className="h-14 w-14 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                  {coffee.image_url && !isPlaceholderImage(coffee.image_url) ? (
                    <img 
                      src={coffee.image_url} 
                      alt={coffee.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Coffee className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">{coffee.name}</h4>
                  <p className="text-sm text-gray-500">{coffee.roasters?.name || 'Unknown Roaster'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            {reviewCount > 0 ? "No recent coffees found" : "You haven't logged any coffees yet"}
          </div>
        )}
      </div>
      
      <Button
        onClick={onAddNewCoffee}
        className="w-full bg-roast-500 hover:bg-roast-600 flex items-center justify-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        Add New Coffee
      </Button>
      
      <div className="flex justify-end pt-4 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default RecentCoffeesSelector;
