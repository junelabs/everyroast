
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  showActionButtons: boolean;
  customActions?: React.ReactNode;
  onReview?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  hasReviewId?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  showActionButtons, 
  customActions, 
  onReview, 
  onDelete,
  isDeleting = false,
  hasReviewId = false
}) => {
  if (customActions) {
    return <>{customActions}</>;
  }
  
  if (!showActionButtons) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-3">
      <Button 
        className="w-full bg-roast-500 hover:bg-roast-600 text-white"
      >
        Add to Favorites
      </Button>
      
      <div className="flex space-x-2">
        {onReview && (
          <Button 
            variant="outline"
            className="flex-1"
            onClick={onReview}
          >
            Edit Review
          </Button>
        )}
        
        {hasReviewId && onDelete && (
          <Button 
            variant="ghost"
            className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
