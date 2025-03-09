
import React from 'react';
import { X } from 'lucide-react';
import { Coffee } from '@/types/coffee';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { getRoastLevelEmoji, getProcessMethodEmoji } from '@/utils/coffeeUtils';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CoffeeDetailModalProps {
  coffee: Coffee;
  isOpen: boolean;
  onClose: () => void;
  onReview?: () => void;
}

const CoffeeDetailModal: React.FC<CoffeeDetailModalProps> = ({ 
  coffee, 
  isOpen, 
  onClose,
  onReview 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">Coffee Details</DialogTitle>
        <div className="grid md:grid-cols-2">
          {/* Coffee Image Section */}
          <div className="relative h-64 md:h-full">
            <img 
              src={coffee.image} 
              alt={coffee.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Coffee Details Section */}
          <div className="p-6 bg-white">
            <div className="flex items-center mb-2">
              <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{coffee.rating}</span>
              </div>
              <span className="ml-2 text-sm text-gray-500">#{coffee.id}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{coffee.name}</h2>
            <p className="text-roast-500 font-medium mb-4">{coffee.roaster}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Origin</div>
                <div className="font-medium">{coffee.origin}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Price</div>
                <div className="font-medium">${coffee.price.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Roast Level</div>
                <div className="font-medium flex items-center">
                  <span className="mr-1">{getRoastLevelEmoji(coffee.roastLevel)}</span>
                  {coffee.roastLevel}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Process</div>
                <div className="font-medium flex items-center">
                  <span className="mr-1">{getProcessMethodEmoji(coffee.processMethod)}</span>
                  {coffee.processMethod}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Your Review</h3>
              <p className="text-gray-700 mb-2">{coffee.flavor || "No review provided yet"}</p>
              
              {coffee.brewingMethod && (
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Brewing Method:</span> {coffee.brewingMethod}
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button 
                className="w-full bg-roast-500 hover:bg-roast-600 text-white"
              >
                Add to Favorites
              </Button>
              
              {onReview && (
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={onReview}
                >
                  Edit Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoffeeDetailModal;
