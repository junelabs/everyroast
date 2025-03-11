
import React from 'react';

interface ReviewSectionProps {
  flavor: string;
  brewingMethod?: string;
  reviewDate?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ 
  flavor, 
  brewingMethod, 
  reviewDate 
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Extract flavor notes, assuming they're comma separated
  const flavorNotes = flavor?.split(',').map(note => note.trim()).filter(Boolean) || [];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Your Review</h3>
      
      {/* Show flavor notes as tags when available */}
      {flavorNotes.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-3">
          {flavorNotes.map((note, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
            >
              {note}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 mb-2">{flavor || "No review provided yet"}</p>
      )}
      
      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
        {brewingMethod && (
          <div>
            <span className="font-medium">Brewing Method:</span> {brewingMethod}
          </div>
        )}
        
        {reviewDate && (
          <div>
            <span>Reviewed on {formatDate(reviewDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
