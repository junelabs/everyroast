
import { CoffeeOrigin, ProcessMethod, RoastLevel } from "@/types/coffee";

export const useCoffeeData = (review: any) => {
  // Debug log to help troubleshoot
  console.log("Raw review data in useCoffeeData:", review);

  // Early return with default values if review is null or undefined
  if (!review) {
    console.error("Review data is missing in useCoffeeData");
    return { 
      coffee: {
        id: null,
        name: "Unknown Coffee",
        origin: "Ethiopia" as CoffeeOrigin,
        roaster: "Unknown Roaster",
        image: null,
        rating: 0,
        price: 0,
        roastLevel: "Light" as RoastLevel,
        processMethod: "Washed" as ProcessMethod,
        flavor: "No flavor notes provided",
        brewingMethod: "",
        reviewDate: null,
        reviewId: null,
        type: "Single Origin",
        poster: {
          username: "anonymous",
          avatarUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
          userId: null
        }
      } 
    };
  }

  // Helper function to check if an image URL is valid and not a placeholder
  const getValidImageUrl = (url: string | null | undefined): string | null => {
    // Return null if the URL is missing, empty, or contains placeholder text
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return null;
    }
    
    // If the URL contains "placeholder" or "gravatar" or "unsplash", it's likely a placeholder
    if (url.includes('placeholder') || url.includes('gravatar') || url.includes('unsplash')) {
      return null;
    }
    
    return url;
  };

  // Prepares structured coffee data from a review object
  const coffee = {
    id: review?.coffee_id || review?.coffees?.id,
    name: review?.coffees?.name || review?.name || "Unnamed Coffee",
    origin: (review?.coffees?.origin || review?.origin || "Ethiopia") as CoffeeOrigin,
    roaster: review?.coffees?.roasters?.name || review?.roaster || "Unknown Roaster",
    image: getValidImageUrl(review?.coffees?.image_url || review?.image_url),
    rating: review?.rating || 0,
    price: review?.coffees?.price || review?.price || 0,
    roastLevel: (review?.coffees?.roast_level || review?.roast_level || "Light") as RoastLevel,
    processMethod: (review?.coffees?.process_method || review?.process_method || "Washed") as ProcessMethod,
    flavor: review?.coffees?.flavor_notes || review?.flavor_notes || review?.review_text || "No flavor notes provided",
    brewingMethod: review?.brewing_method || "",
    reviewDate: review?.created_at,
    reviewId: review?.id,
    // Get the actual type from the database, with fallback only if not present
    type: review?.coffees?.type || review?.type || "Single Origin",
    poster: {
      username: review?.profiles?.username || "anonymous",
      avatarUrl: review?.profiles?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
      userId: review?.coffees?.created_by || review?.user_id || null
    }
  };

  // Debug log for the processed coffee data
  console.log("Processed coffee data in useCoffeeData:", coffee);

  return { coffee };
};

export const formatReviewDate = (dateString: string) => {
  if (!dateString) return "Unknown date";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};
