
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import CoffeeSubmissionForm from './CoffeeSubmissionForm';
import { useAuth } from '@/context/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  const { user, profile } = useAuth();
  
  // Check if user is admin (for now just checking if they're authenticated)
  // In a real app, you would implement proper role-based checks
  const isAdmin = !!user;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Coffee (Admin Only)</DialogTitle>
          <DialogDescription>
            Add an official coffee to this roaster's catalog.
          </DialogDescription>
        </DialogHeader>
        
        {isAdmin ? (
          <CoffeeSubmissionForm
            roasterId={roasterId}
            onSuccess={() => {
              onSuccess();
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to be an administrator to add official coffees to roasters.
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CoffeeSubmissionDialog;
