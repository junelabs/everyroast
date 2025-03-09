
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Coffee } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CoffeeOrigin, RoastLevel, ProcessMethod, CoffeeType, SizeUnit } from "@/types/coffee";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [brewingMethod, setBrewingMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4 border-b pb-4">
            <h3 className="font-medium">Coffee Details</h3>
            
            <div className="space-y-2">
              <label htmlFor="coffeeName" className="block text-sm font-medium">
                Coffee Name *
              </label>
              <Input
                id="coffeeName"
                placeholder="e.g., Ethiopian Yirgacheffe"
                value={coffeeName}
                onChange={(e) => setCoffeeName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="roaster" className="block text-sm font-medium">
                Roaster *
              </label>
              <Input
                id="roaster"
                placeholder="e.g., Stumptown Coffee"
                value={roaster}
                onChange={(e) => setRoaster(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="origin" className="block text-sm font-medium">
                  Origin
                </label>
                <Select 
                  value={origin} 
                  onValueChange={(value: CoffeeOrigin) => setOrigin(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {origins.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="coffeeType" className="block text-sm font-medium">
                  Type
                </label>
                <Select 
                  value={coffeeType} 
                  onValueChange={(value: CoffeeType) => setCoffeeType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select coffee type" />
                  </SelectTrigger>
                  <SelectContent>
                    {coffeeTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
                <label htmlFor="price" className="block text-sm font-medium">
                  Price (USD)
                </label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={price || ''}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2 col-span-1">
                <label htmlFor="size" className="block text-sm font-medium">
                  Size
                </label>
                <Input
                  id="size"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={size || ''}
                  onChange={(e) => setSize(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2 col-span-1">
                <label htmlFor="sizeUnit" className="block text-sm font-medium">
                  Unit
                </label>
                <Select 
                  value={sizeUnit} 
                  onValueChange={(value: SizeUnit) => setSizeUnit(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="roastLevel" className="block text-sm font-medium">
                  Roast Level
                </label>
                <Select 
                  value={roastLevel} 
                  onValueChange={(value: RoastLevel) => setRoastLevel(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select roast level" />
                  </SelectTrigger>
                  <SelectContent>
                    {roastLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="processMethod" className="block text-sm font-medium">
                  Process Method
                </label>
                <Select 
                  value={processMethod} 
                  onValueChange={(value: ProcessMethod) => setProcessMethod(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select process method" />
                  </SelectTrigger>
                  <SelectContent>
                    {processMethods.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="flavor" className="block text-sm font-medium">
                Flavor Notes
              </label>
              <Input
                id="flavor"
                placeholder="e.g., Floral, Citrus, Chocolate"
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Your Review</h3>
            
            <div className="space-y-2">
              <label htmlFor="rating" className="block text-sm font-medium">
                Rating *
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star 
                      className={`h-6 w-6 ${
                        (hoverRating || rating) >= star 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="brewingMethod" className="block text-sm font-medium">
                Brewing Method (optional)
              </label>
              <Input
                id="brewingMethod"
                placeholder="e.g., Pour Over, French Press, Espresso"
                value={brewingMethod}
                onChange={(e) => setBrewingMethod(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reviewText" className="block text-sm font-medium">
                Your Review
              </label>
              <textarea
                id="reviewText"
                rows={4}
                placeholder="Share your thoughts about this coffee..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-roast-500"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
          </div>
          
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
