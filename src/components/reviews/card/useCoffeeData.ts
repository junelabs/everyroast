
import { useMemo } from 'react';
import { format } from 'date-fns';

export const formatReviewDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    return format(new Date(dateStr), 'MMM dd, yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
};

export const useCoffeeData = (review: any = {}) => {
  // Safely extract coffee details from review with null checks
  const coffee = useMemo(() => {
    if (!review || !review.coffees) {
      return {
        id: '',
        name: 'Unknown Coffee',
        image: null,
        roaster: 'Unknown Roaster',
        rating: 0,
        reviewCount: 0,
      };
    }

    return {
      id: review.coffee_id || '',
      name: review.coffees?.name || 'Unknown Coffee',
      image: review.coffees?.image_url || null,
      roaster: review.coffees?.roasters?.name || 'Unknown Roaster',
      rating: review.rating || 0,
      reviewCount: 1,
      roasterId: review.coffees?.roaster_id || '',
      origin: review.coffees?.origin || 'Unknown',
      roastLevel: review.coffees?.roast_level || 'Medium',
      processMethod: review.coffees?.process_method || '',
      price: review.coffees?.price || 0,
      type: review.coffees?.type || '',
      reviews: Array.isArray(review.reviews) ? review.reviews : [],
      flavorNotes: review.coffees?.flavor_notes || '',
      createdAt: review.created_at,
      reviewText: review.review_text || '',
      brewingMethod: review.brewing_method || '',
      brewTime: review.brew_time || '',
      water: review.water || 0,
      dosage: review.dosage || 0,
      temperature: review.temperature || 0,
      brewNotes: review.brew_notes || '',
    };
  }, [review]);

  return { coffee };
};
