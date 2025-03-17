
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Roaster name must be at least 2 characters' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State or Country is required' }),
  website: z.string().optional(),
  instagram: z.string().optional(),
  email: z.string().email({ message: 'Please provide a valid email for confirmation' }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RoasterSubmissionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoasterSubmissionDialog: React.FC<RoasterSubmissionDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

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
  React.useEffect(() => {
    if (isOpen) {
      form.reset();
      setShowThankYou(false);
    }
  }, [isOpen, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Format Instagram handle if provided
      let instagramHandle = data.instagram || '';
      if (instagramHandle && !instagramHandle.startsWith('@')) {
        instagramHandle = '@' + instagramHandle;
      }

      // Add submission to database
      const { error } = await supabase.from('roaster_submissions').insert({
        name: data.name,
        city: data.city,
        state: data.state,
        website: data.website || null,
        instagram: instagramHandle || null,
        user_id: user?.id || null, // Make user_id optional
        email: data.email || null, // Store email for non-authenticated users
      });

      if (error) throw error;

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

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roaster Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter roaster name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State or Country*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state or country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="@roaster_handle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!user && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Roaster'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
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
            <Button onClick={handleClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoasterSubmissionDialog;
