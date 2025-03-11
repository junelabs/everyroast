
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

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  coffeeName: string;
  onDelete: () => void;
  isDeleting: boolean;
  deleteType?: 'review' | 'coffee';
  isHardDelete?: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  coffeeName,
  onDelete,
  isDeleting,
  deleteType = 'review',
  isHardDelete = false
}) => {
  const title = deleteType === 'coffee' ? 
    "Remove this coffee?" : 
    "Delete this review?";
    
  const description = deleteType === 'coffee' ?
    `This will remove "${coffeeName}" from the community listings. This action cannot be undone.` :
    `This will permanently delete your review of "${coffeeName}". This action cannot be undone.`;
    
  const buttonText = deleteType === 'coffee' ?
    (isDeleting ? "Removing..." : "Remove Coffee") :
    (isDeleting ? "Deleting..." : "Delete Review");
    
  const handleDeleteClick = () => {
    onDelete();
    // Don't close the dialog here - let the delete operation handle it
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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

export default DeleteConfirmDialog;
