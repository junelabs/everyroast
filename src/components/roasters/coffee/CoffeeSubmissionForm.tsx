
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createCoffeeForRoaster, bulkAddCoffeesToRoaster } from '@/services/roasterService';
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
import { Coffee, X, Plus, Upload, Check, AlertCircle } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

// Passenger Coffee data for bulk import
const PASSENGER_COFFEES = [
  {
    name: 'Bhadra',
    origin: 'India',
    flavor: 'Citrus, Black Tea, Stone Fruit',
    price: 19.00,
    type: 'Single Origin',
    roastLevel: 'Medium',
    processMethod: 'Washed',
  },
  {
    name: 'Stowaway',
    origin: 'Blend',
    flavor: 'Florals, Browning Sugars, Cocoa',
    price: 18.25,
    type: 'Blend',
    roastLevel: 'Medium',
    processMethod: 'Washed',
  },
  {
    name: 'Keystone',
    origin: 'Blend',
    flavor: 'Florals, Cooked Fruit, Browning Sugars',
    price: 18.75,
    type: 'Blend',
    roastLevel: 'Medium',
    processMethod: 'Washed',
  },
  {
    name: 'Agaro',
    origin: 'Ethiopia',
    flavor: 'Bergamot, Peach, Meyer Lemon',
    price: 19.00,
    type: 'Single Origin',
    roastLevel: 'Light',
    processMethod: 'Washed',
  },
  {
    name: 'Cusco',
    origin: 'Peru',
    flavor: 'Chocolate, Marzipan, Red Fruit',
    price: 17.75,
    type: 'Single Origin',
    roastLevel: 'Medium',
    processMethod: 'Washed',
  },
  {
    name: 'Montecarlos',
    origin: 'El Salvador',
    flavor: 'Clementine, Cocoa, Toasted Nuts',
    price: 18.25,
    type: 'Single Origin',
    roastLevel: 'Medium',
    processMethod: 'Washed',
  },
  {
    name: 'Divino Niño',
    origin: 'Colombia',
    flavor: 'Cherry, Marzipan, Caramel',
    price: 19.50,
    type: 'Single Origin',
    roastLevel: 'Medium',
    processMethod: 'Washed',
  },
  {
    name: 'Heza',
    origin: 'Burundi',
    flavor: 'Raspberry, Black Tea, Apricot',
    price: 20.00,
    type: 'Single Origin',
    roastLevel: 'Light',
    processMethod: 'Washed',
  },
  {
    name: 'Daterra',
    origin: 'Brazil',
    flavor: 'Chocolate, Dried Fruit, Hazelnut',
    price: 17.75,
    type: 'Single Origin',
    roastLevel: 'Medium',
    processMethod: 'Natural',
  },
  {
    name: 'Los Sueños Decaf',
    origin: 'Colombia',
    flavor: 'Cherry, Black Tea, Caramel',
    price: 18.75,
    type: 'Decaf',
    roastLevel: 'Medium',
    processMethod: 'Washed',
  },
];

const CoffeeSubmissionForm: React.FC<CoffeeSubmissionFormProps> = ({
  roasterId,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const [showBulkAddDialog, setShowBulkAddDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Bulk add Passenger coffees
  const handleBulkAddPassengerCoffees = async () => {
    setIsSubmitting(true);
    try {
      const result = await bulkAddCoffeesToRoaster(roasterId, PASSENGER_COFFEES);
      
      if (result.success) {
        toast({
          title: 'Coffees Added',
          description: `Successfully added ${result.count} coffees to the roaster.`,
        });
        onSuccess();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add coffees. Please try again.',
          variant: 'destructive',
        });
        
        if (result.failedCoffees && result.failedCoffees.length > 0) {
          console.error('Failed coffees:', result.failedCoffees);
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      console.error('Error bulk adding coffees:', error);
    } finally {
      setIsSubmitting(false);
      setShowBulkAddDialog(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={() => setShowBulkAddDialog(true)} 
          className="bg-green-600 hover:bg-green-700"
        >
          <Upload className="mr-2 h-4 w-4" />
          Add Passenger Coffees
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Row 1: Name, Origin, Price */}
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Coffee name" {...field} />
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
                    <Input placeholder="Country/Region" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

          {/* Row 2: Type, Roast, Process Method */}
          <div className="grid grid-cols-3 gap-4">
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
                      placeholder="E.g., Blueberry, Chocolate, Floral"
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

      {/* Bulk Add Confirmation Dialog */}
      <AlertDialog open={showBulkAddDialog} onOpenChange={setShowBulkAddDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Passenger Coffees</AlertDialogTitle>
            <AlertDialogDescription>
              This will add 10 Passenger coffee varieties to the roaster. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                handleBulkAddPassengerCoffees();
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Confirm
                </span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CoffeeSubmissionForm;
