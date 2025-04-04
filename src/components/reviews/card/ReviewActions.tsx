
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';

interface ReviewActionsProps {
  review: any;
  onEdit: () => void;
  onOpenDeleteDialog: (type: 'review' | 'coffee') => void;
  isDeleting: boolean;
}

const ReviewActions = React.memo(({ review, onEdit, onOpenDeleteDialog, isDeleting }: ReviewActionsProps) => {
  const { user } = useAuth();
  const isOwner = user && review.coffees?.created_by === user.id;

  return (
    <div className="space-y-3 mt-4">
      <div className="flex space-x-2">
        <Button 
          variant="outline"
          className="flex-1"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
        >
          Edit Review
        </Button>
        
        <Button 
          variant="ghost"
          className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          onClick={() => onOpenDeleteDialog('review')}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Review"}
        </Button>
      </div>
      
      {isOwner && (
        <Button 
          variant="destructive"
          className="w-full"
          onClick={() => onOpenDeleteDialog('coffee')}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting Coffee..." : "Delete Coffee Post"}
        </Button>
      )}
    </div>
  );
});

ReviewActions.displayName = 'ReviewActions';

export default ReviewActions;
