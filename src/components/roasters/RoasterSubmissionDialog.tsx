
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SubmissionForm } from './submission/SubmissionForm';
import { ThankYouMessage } from './submission/ThankYouMessage';
import { useRoasterSubmission } from './submission/useRoasterSubmission';

interface RoasterSubmissionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoasterSubmissionDialog: React.FC<RoasterSubmissionDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const {
    form,
    isSubmitting,
    showThankYou,
    handleSubmit,
    handleClose,
  } = useRoasterSubmission(isOpen, onOpenChange);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!showThankYou ? (
          <>
            <DialogHeader>
              <DialogTitle>Submit a Roaster</DialogTitle>
              <DialogDescription>
                Help expand our roaster database by submitting a coffee roaster that's not listed.
              </DialogDescription>
            </DialogHeader>

            <SubmissionForm
              form={form}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              isSubmitting={isSubmitting}
            />
          </>
        ) : (
          <ThankYouMessage onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoasterSubmissionDialog;
