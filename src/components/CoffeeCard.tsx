
import React, { useState } from 'react';
import { Heart, ThumbsUp, MessageSquare, ChevronUp } from 'lucide-react';
import { Coffee } from '@/types/coffee';
import { getRoastLevelEmoji, getProcessMethodEmoji } from '@/utils/coffeeUtils';
import CoffeeDetailModal from './CoffeeDetailModal';
import ReviewForm from './reviews/ReviewForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative overflow-hidden rounded-xl shadow-md group transition-all hover:shadow-xl block aspect-square bg-white cursor-pointer"
      >
        <div className="w-full h-full relative">
          <img 
            src={coffee.image} 
            alt={coffee.name} 
            className="w-full h-full object-cover"
          />
          
          {/* Consistent overlay over the whole card */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
          
          {/* Posted by - in top left */}
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
            <span className="text-sm mr-1">Posted by:</span>
            <Avatar className="h-6 w-6">
              <AvatarImage src={coffee.poster?.avatarUrl} />
              <AvatarFallback>{coffee.poster?.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm">@{coffee.poster?.username}</span>
          </div>
          
          {/* Upvotes (replacing Rating) */}
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
            <ChevronUp className="h-4 w-4 text-green-400" />
            <span className="text-lg font-medium">{coffee.upvotes || 0}</span>
          </div>
          
          {/* Rating (moved to bottom right) */}
          <div className="absolute bottom-24 right-4 z-10 flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
            <span className="text-sm font-medium">★ {coffee.rating}</span>
          </div>
          
          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 z-10 text-white p-4">
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="text-2xl font-bold">{coffee.name}</h3>
              </div>
            </div>
            
            <div className="flex justify-between mb-2">
              <div className="flex items-center text-gray-100">
                <span className="mr-1">☕️</span>
                <span>{coffee.roaster}</span>
              </div>
              <div className="flex items-center text-gray-200">
                <span className="mr-1">📍</span>
                <span>{coffee.origin}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20">
              <div className="flex items-center">
                <span className="text-lg mr-1">{getRoastLevelEmoji(coffee.roastLevel)}</span>
                <div className="text-sm">{coffee.roastLevel}</div>
              </div>
              
              <div className="flex items-center">
                <span className="text-lg mr-1">{getProcessMethodEmoji(coffee.processMethod)}</span>
                <div className="text-sm">{coffee.processMethod}</div>
              </div>
              
              <div className="flex items-center justify-end">
                <span className="text-lg mr-1">💰</span>
                <div className="text-sm">${coffee.price.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <ChevronUp className="h-4 w-4 mr-2" />
                Upvote
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
