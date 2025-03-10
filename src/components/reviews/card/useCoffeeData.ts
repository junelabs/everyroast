
import { CoffeeOrigin, ProcessMethod, RoastLevel } from "@/types/coffee";

export const useCoffeeData = (review: any) => {
  // Add more extensive debug logging to track the type field
  console.log("Full review object:", review);
  console.log("Coffee type field:", review.coffees?.type);
  
  // Prepares structured coffee data from a review object
  const coffee = {
    id: review.coffee_id,
    name: review.coffees?.name || "Unnamed Coffee",
    origin: (review.coffees?.origin || "Ethiopia") as CoffeeOrigin,
    roaster: review.coffees?.roasters?.name || "Unknown Roaster",
    image: review.coffees?.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: review.rating,
    price: review.coffees?.price || 0,
    roastLevel: (review.coffees?.roast_level || "Medium") as RoastLevel,
    processMethod: (review.coffees?.process_method || "Washed") as ProcessMethod,
    flavor: review.review_text || "No flavor notes provided",
    brewingMethod: review.brewing_method || "",
    reviewDate: review.created_at,
    reviewId: review.id,
    // Get the actual type from the database, with fallback only if not present
    type: review.coffees?.type || "Single Origin"
  };

  return { coffee };
};

export const formatReviewDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
