
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import CoffeeSubmissionForm from './CoffeeSubmissionForm';

interface CoffeeSubmissionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  roasterId: string;
  onSuccess: () => void;
}

const CoffeeSubmissionDialog: React.FC<CoffeeSubmissionDialogProps> = ({
  isOpen,
  onOpenChange,
  roasterId,
  onSuccess,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Coffee</DialogTitle>
          <DialogDescription>
            Add a new coffee to this roaster's catalog.
          </DialogDescription>
        </DialogHeader>
        
        <CoffeeSubmissionForm
          roasterId={roasterId}
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoffeeSubmissionDialog;
