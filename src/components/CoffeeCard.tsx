
import React, { useState } from 'react';
import { Heart, MessageSquare, ChevronUp } from 'lucide-react';
import { Coffee } from '@/types/coffee';
import { Card, CardContent } from '@/components/ui/card';
import CoffeeDetailModal from './CoffeeDetailModal';
import ReviewForm from './reviews/ReviewForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface CoffeeCardProps {
  coffee: Coffee;
}

const CoffeeCard: React.FC<CoffeeCardProps> = ({ coffee }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const { toast } = useToast();

  // Debug to make sure type is passed to the coffee object
  console.log('Coffee in CoffeeCard:', coffee);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    toast({
      title: "Upvoted!",
      description: `You upvoted ${coffee.name}`,
      duration: 3000,
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    toast({
      title: "Added to Wishlist",
      description: `${coffee.name} has been added to your wishlist`,
      duration: 3000,
    });
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    setIsReviewFormOpen(true);
  };

  return (
    <>
      <Card 
        onClick={() => setIsModalOpen(true)}
        className="h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      >
        {coffee.image && (
          <div className="relative aspect-[4/3]">
            <img 
              src={coffee.image} 
              alt={coffee.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <CardContent className={`p-3 ${!coffee.image ? 'pt-3' : ''}`}>
          <h3 className="font-bold text-base mb-1 line-clamp-1">{coffee.name}</h3>
          
          <div className="flex justify-between text-xs text-gray-600 mb-1.5">
            <span>{coffee.roaster}</span>
            <span>{coffee.origin}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 border-t pt-1.5">
            <div className="flex flex-col">
              <span className="text-gray-600 font-medium">Roast</span>
              <span>{coffee.roastLevel}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-600 font-medium">Process</span>
              <span>{coffee.processMethod}</span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-gray-600 font-medium">Price</span>
              <span>${coffee.price.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CoffeeDetailModal 
        coffee={coffee} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onReview={() => {
          setIsModalOpen(false);
          setIsReviewFormOpen(true);
        }}
        showActionButtons={true}
        customActions={
          <div className="space-y-3 mt-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 bg-[#ea384c] hover:bg-[#d92d41] text-white border-[#ea384c] hover:border-[#d92d41]"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-4 w-4" />
              Add to Wishlist
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center"
                onClick={handleUpvote}
              >
                <div className="flex items-center gap-1">
                  <ChevronUp className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-emerald-600">{coffee.upvotes || 0}</span>
                </div>
                <span className="ml-1">Upvote</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center"
                onClick={handleReviewClick}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Review
              </Button>
            </div>
          </div>
        }
      />
      
      <ReviewForm 
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        coffeeId={String(coffee.id)}
      />
    </>
  );
};

export default CoffeeCard;
