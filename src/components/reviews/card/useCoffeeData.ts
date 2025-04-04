
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
        origin: 'Unknown Origin', // Add missing required fields
        roastLevel: 'Medium',
        processMethod: 'Unknown',
        price: 0,
        flavor: 'No flavor notes available', // Add required flavor field
        type: 'Unknown',
        // Additional fields that might be used
        reviewDate: review?.created_at || '',
        reviewId: review?.id || '',
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
      origin: review.coffees?.origin || 'Unknown Origin',
      roastLevel: review.coffees?.roast_level || 'Medium',
      processMethod: review.coffees?.process_method || 'Unknown',
      price: review.coffees?.price || 0,
      type: review.coffees?.type || 'Single Origin',
      reviews: Array.isArray(review.reviews) ? review.reviews : [],
      // Make sure flavor is always provided
      flavor: review.coffees?.flavor_notes || review.review_text || 'No flavor notes available',
      createdAt: review.created_at,
      reviewText: review.review_text || '',
      brewingMethod: review.brewing_method || '',
      brewTime: review.brew_time || '',
      water: review.water || 0,
      dosage: review.dosage || 0,
      temperature: review.temperature || 0,
      brewNotes: review.brew_notes || '',
      // Additional fields that might be used
      reviewDate: review.created_at || '',
      reviewId: review.id || '',
    };
  }, [review]);

  return { coffee };
};
