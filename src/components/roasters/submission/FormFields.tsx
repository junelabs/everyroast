
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';

interface FormFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const FormFields: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <>
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

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email (optional)</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="your@email.com (optional)" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
