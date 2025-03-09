
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CoffeeOrigin, RoastLevel, ProcessMethod, CoffeeType, SizeUnit } from "@/types/coffee";
import CoffeeDetailsSection from "./form/CoffeeDetailsSection";
import ReviewSection from "./form/ReviewSection";
import ImageUpload from "./form/ImageUpload";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  coffeeId?: string;
}

const ReviewForm = ({ isOpen, onClose, coffeeId }: ReviewFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [brewingMethod, setBrewingMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [coffeeName, setCoffeeName] = useState("");
  const [roaster, setRoaster] = useState("");
  const [origin, setOrigin] = useState<CoffeeOrigin>("Ethiopia");
  const [roastLevel, setRoastLevel] = useState<RoastLevel>("Light");
  const [processMethod, setProcessMethod] = useState<ProcessMethod>("Washed");
  const [coffeeType, setCoffeeType] = useState<CoffeeType>("Single Origin");
  const [price, setPrice] = useState<number>(0);
  const [flavor, setFlavor] = useState("");
  const [size, setSize] = useState<number>(0);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>("g");

  const origins: CoffeeOrigin[] = [
    'Ethiopia', 'Colombia', 'Brazil', 'Guatemala', 'Costa Rica', 'Kenya',
    'Peru', 'Indonesia', 'Vietnam', 'Honduras', 'Mexico', 'Rwanda',
    'Tanzania', 'Uganda', 'India', 'Panama', 'Jamaica', 'Haiti',
    'El Salvador', 'Yemen'
  ];
  const roastLevels: RoastLevel[] = ['Light', 'Medium', 'Medium-Dark', 'Dark'];
  const processMethods: ProcessMethod[] = ['Washed', 'Natural', 'Honey', 'Anaerobic'];
  const coffeeTypes: CoffeeType[] = ['Single Origin', 'Blend', 'Espresso'];
  const sizeUnits: SizeUnit[] = ['g', 'oz'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review.",
        variant: "destructive"
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    if (!coffeeName) {
      toast({
        title: "Coffee name required",
        description: "Please enter a name for the coffee.",
        variant: "destructive"
      });
      return;
    }
    
    if (!roaster) {
      toast({
        title: "Roaster required",
        description: "Please enter a roaster name.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let coffeeRecord;
      
      if (coffeeId) {
        const { data } = await supabase
          .from('coffees')
          .select('*')
          .eq('id', coffeeId)
          .single();
        
        coffeeRecord = data;
      } else {
        const { data: roasterData, error: roasterError } = await supabase
          .from('roasters')
          .select('id')
          .eq('name', roaster)
          .maybeSingle();
        
        let roasterId;
        
        if (!roasterData) {
          const { data: newRoaster, error: newRoasterError } = await supabase
            .from('roasters')
            .insert({
              name: roaster,
              created_by: user.id
            })
            .select('id')
            .single();
          
          if (newRoasterError) throw newRoasterError;
          roasterId = newRoaster.id;
        } else {
          roasterId = roasterData.id;
        }
        
        const coffeeData = {
          name: coffeeName,
          roaster_id: roasterId,
          origin: origin,
          roast_level: roastLevel,
          process_method: processMethod,
          price: price,
          flavor_notes: flavor,
          created_by: user.id,
          image_url: imageUrl,
          description: `${coffeeType} coffee, ${size} ${sizeUnit}`
        };
        
        const { data: newCoffee, error: newCoffeeError } = await supabase
          .from('coffees')
          .insert(coffeeData)
          .select('id')
          .single();
        
        if (newCoffeeError) throw newCoffeeError;
        coffeeRecord = newCoffee;
      }
      
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          coffee_id: coffeeRecord.id,
          user_id: user.id,
          rating,
          review_text: reviewText,
          brewing_method: brewingMethod || null
        });
        
      if (error) throw error;
      
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience!",
      });
      
      resetForm();
      onClose();
      navigate("/profile");
      
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setReviewText("");
    setBrewingMethod("");
    setCoffeeName("");
    setRoaster("");
    setOrigin("Ethiopia");
    setRoastLevel("Light");
    setProcessMethod("Washed");
    setCoffeeType("Single Origin");
    setPrice(0);
    setFlavor("");
    setSize(0);
    setSizeUnit("g");
    setImageUrl(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-roast-500" />
            Share Your Coffee Experience
          </DialogTitle>
          <DialogDescription>
            Let the community know what you think about this coffee.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <ImageUpload 
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
          />
          
          <CoffeeDetailsSection 
            coffeeName={coffeeName}
            setCoffeeName={setCoffeeName}
            roaster={roaster}
            setRoaster={setRoaster}
            origin={origin}
            setOrigin={setOrigin}
            coffeeType={coffeeType}
            setCoffeeType={setCoffeeType}
            price={price}
            setPrice={setPrice}
            size={size}
            setSize={setSize}
            sizeUnit={sizeUnit}
            setSizeUnit={setSizeUnit}
            roastLevel={roastLevel}
            setRoastLevel={setRoastLevel}
            processMethod={processMethod}
            setProcessMethod={setProcessMethod}
            flavor={flavor}
            setFlavor={setFlavor}
            origins={origins}
            roastLevels={roastLevels}
            processMethods={processMethods}
            coffeeTypes={coffeeTypes}
            sizeUnits={sizeUnits}
          />
          
          <ReviewSection
            rating={rating}
            setRating={setRating}
            brewingMethod={brewingMethod}
            setBrewingMethod={setBrewingMethod}
            reviewText={reviewText}
            setReviewText={setReviewText}
          />
          
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
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
