import { CoffeeOrigin, ProcessMethod, RoastLevel } from "@/types/coffee";

export const useCoffeeData = (review: any) => {
  // Prepares structured coffee data from a review object
  const coffee = {
    id: review.coffee_id,
    name: review.coffees?.name || "Unnamed Coffee",
    origin: (review.coffees?.origin || "Ethiopia") as CoffeeOrigin,
    roaster: review.coffees?.roasters?.name || "Unknown Roaster",
    image: review.coffees?.image_url || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: review.rating,
    price: review.coffees?.price || 0,
    roastLevel: (review.coffees?.roast_level || "Light") as RoastLevel,
    processMethod: (review.coffees?.process_method || "Washed") as ProcessMethod,
    flavor: review.coffees?.flavor_notes || review.review_text || "No flavor notes provided",
    brewingMethod: review.brewing_method || "",
    reviewDate: review.created_at,
    reviewId: review.id,
    // Get the actual type from the database, with fallback only if not present
    type: review.coffees?.type || "Single Origin",
    poster: {
      username: review.profiles?.username || "anonymous",
      avatarUrl: review.profiles?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
      userId: review.coffees?.created_by || review.user_id || null
    }
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
