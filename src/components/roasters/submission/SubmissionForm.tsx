
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormValues } from './types';
import { FormFields } from './FormFields';
import { DialogFooter } from '@/components/ui/dialog';

interface SubmissionFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  form,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormFields form={form} />
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Roaster'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
