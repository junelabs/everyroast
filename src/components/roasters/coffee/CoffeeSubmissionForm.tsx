import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createCoffeeForRoaster } from '@/services/roasterService';
import { useToast } from '@/components/ui/use-toast';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Coffee, X, Plus } from 'lucide-react';

// Validation schema for the coffee submission form
const formSchema = z.object({
  name: z.string().min(1, { message: 'Coffee name is required' }),
  origin: z.string().min(1, { message: 'Origin is required' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  roastLevel: z.string().min(1, { message: 'Roast level is required' }),
  processMethod: z.string().min(1, { message: 'Process method is required' }),
  flavor: z.string().optional(),
  type: z.string().min(1, { message: 'Coffee type is required' }),
  image: z.string().optional(),
});

// Type for the form data
type FormValues = z.infer<typeof formSchema>;

interface CoffeeSubmissionFormProps {
  roasterId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// Available options for the form select fields
const ROAST_LEVELS = ['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'];
const PROCESS_METHODS = ['Washed', 'Natural', 'Honey', 'Anaerobic', 'Wet-Hulled'];
const COFFEE_TYPES = ['Single Origin', 'Blend', 'Espresso', 'Decaf'];

const CoffeeSubmissionForm: React.FC<CoffeeSubmissionFormProps> = ({
  roasterId,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      origin: '',
      price: 0,
      roastLevel: 'Medium',
      processMethod: 'Washed',
      flavor: '',
      type: 'Single Origin',
      image: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      const result = await createCoffeeForRoaster(roasterId, {
        name: data.name,
        origin: data.origin,
        price: data.price,
        roastLevel: data.roastLevel,
        processMethod: data.processMethod,
        flavor: data.flavor || '',
        type: data.type,
        image: data.image || null,
      });

      if (result.success) {
        toast({
          title: 'Coffee Added',
          description: `${data.name} has been added to the roaster successfully.`,
        });
        // Reset the form while keeping some fields that may be reused for subsequent entries
        form.reset({
          name: '',
          origin: data.origin, // Keep the origin
          price: data.price, // Keep the price
          roastLevel: data.roastLevel, // Keep the roast level
          processMethod: data.processMethod, // Keep the process method
          flavor: '',
          type: data.type, // Keep the type
          image: data.image, // Keep the image URL if reusing
        });
        onSuccess();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add coffee. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      console.error('Error adding coffee:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1: Coffee Name & Origin */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coffee Name*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Ethiopia Yirgacheffe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Ethiopia, Colombia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Price, Type, Roast, Process */}
        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="19.99"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COFFEE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roastLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roast*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select roast" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROAST_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="processMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Process*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select process" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROCESS_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Flavor Notes & Image URL */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="flavor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flavor Notes</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Blueberry, Dark Chocolate, Floral"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/coffee-image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" className="bg-roast-500 hover:bg-roast-600">
            <Plus className="mr-2 h-4 w-4" />
            Add & Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CoffeeSubmissionForm;
