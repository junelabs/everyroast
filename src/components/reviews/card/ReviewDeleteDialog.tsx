
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReviewDeleteDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  coffeeName: string;
  isDeleting: boolean;
  onDelete: () => Promise<void>;
  deleteType?: 'review' | 'coffee';
}

const ReviewDeleteDialog: React.FC<ReviewDeleteDialogProps> = ({
  isOpen,
  setIsOpen,
  coffeeName,
  isDeleting,
  onDelete,
  deleteType = 'review'
}) => {
  const title = deleteType === 'coffee' ? 
    "Delete this coffee?" : 
    "Delete this review?";
    
  const description = deleteType === 'coffee' ?
    `This will remove "${coffeeName}" from the community. This action cannot be undone.` :
    `This will permanently delete your review of "${coffeeName}". This action cannot be undone.`;
    
  const buttonText = deleteType === 'coffee' ?
    (isDeleting ? "Deleting..." : "Delete Coffee") :
    (isDeleting ? "Deleting..." : "Delete Review");
    
  const handleDeleteClick = async () => {
    // Execute the delete operation but don't close the dialog
    // The parent component will handle closing after the operation completes
    await onDelete();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteClick}
            className="bg-rose-500 hover:bg-rose-600 text-white"
            disabled={isDeleting}
          >
            {buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReviewDeleteDialog;
