
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth';
import { createRoasterSubmission } from '@/services/roasterSubmissionService';
import { formSchema, FormValues, RoasterSubmissionData } from './types';

export const useRoasterSubmission = (isOpen: boolean, onOpenChange: (open: boolean) => void) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      city: '',
      state: '',
      website: '',
      instagram: '',
      email: '',
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset();
      setShowThankYou(false);
    }
  }, [isOpen, form]);

  const handleSubmit = async (data: FormValues) => {
    console.log("Submitting roaster data:", data);
    setIsSubmitting(true);
    
    try {
      // Format Instagram handle if provided
      let instagramHandle = data.instagram || '';
      if (instagramHandle && !instagramHandle.startsWith('@')) {
        instagramHandle = '@' + instagramHandle;
      }

      // Prepare submission data
      const submissionData: RoasterSubmissionData = {
        name: data.name,
        city: data.city,
        state: data.state,
        website: data.website || null,
        instagram: instagramHandle || null,
        email: data.email || null,
        user_id: user?.id || null,
      };

      // Use the service function to submit the roaster
      const result = await createRoasterSubmission(submissionData);

      if (!result) {
        throw new Error('Failed to submit roaster');
      }

      // Invalidate queries to refresh roaster data
      queryClient.invalidateQueries({ queryKey: ['roasters'] });
      
      // Show thank you message
      setShowThankYou(true);
      form.reset();
      
      // Show a toast notification
      toast.success("Thank you for submitting a roaster!");
    } catch (error) {
      console.error('Error submitting roaster:', error);
      toast.error('Failed to submit roaster. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close dialog handler
  const handleClose = () => {
    // Only allow closing if not in the middle of submitting
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return {
    form,
    isSubmitting,
    showThankYou,
    handleSubmit,
    handleClose,
  };
};
