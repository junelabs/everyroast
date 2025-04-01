
import React from 'react';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ThankYouMessageProps {
  onClose: () => void;
}

export const ThankYouMessage: React.FC<ThankYouMessageProps> = ({ onClose }) => {
  return (
    <div className="py-8 text-center">
      <div className="bg-green-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <DialogTitle className="mb-2">Thank You!</DialogTitle>
      <DialogDescription className="mb-6">
        Your roaster submission has been received. Our team will review it shortly.
      </DialogDescription>
      <Button onClick={onClose}>Close</Button>
    </div>
  );
};
