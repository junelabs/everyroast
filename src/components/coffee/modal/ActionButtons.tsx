
import React from 'react';
import { Trash2, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  showActionButtons: boolean;
  customActions?: React.ReactNode;
  onReview?: () => void;
  onDelete?: () => void;
  onUpvote?: () => void;
  isDeleting?: boolean;
  hasReviewId?: boolean;
  upvotes?: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  showActionButtons, 
  customActions, 
  onReview, 
  onDelete,
  onUpvote,
  isDeleting = false,
  hasReviewId = false,
  upvotes = 0
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
        {onUpvote && (
          <Button
            variant="outline"
            onClick={onUpvote}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <div className="flex items-center gap-1">
              <ChevronUp className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-emerald-600">{upvotes}</span>
            </div>
            <span>Upvote</span>
          </Button>
        )}
        
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
