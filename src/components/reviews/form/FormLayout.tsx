
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DialogFooter,
} from "@/components/ui/dialog";

interface FormLayoutProps {
  children: React.ReactNode;
  isSubmitting: boolean;
  onClose: () => void;
  isEdit: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const FormLayout = ({ 
  children, 
  isSubmitting, 
  onClose, 
  isEdit, 
  onSubmit 
}: FormLayoutProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
      {children}
      
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-roast-500 hover:bg-roast-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : isEdit ? "Update Review" : "Submit Review"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default FormLayout;
