
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Coffee } from '@/types/coffee';
import { getRoastLevelEmoji, getProcessMethodEmoji } from '@/utils/coffeeUtils';
import CoffeeDetailModal from './CoffeeDetailModal';
import ReviewForm from './reviews/ReviewForm';

interface CoffeeCardProps {
  coffee: Coffee;
}

const CoffeeCard: React.FC<CoffeeCardProps> = ({ coffee }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

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
          
          {/* Top indicators */}
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-medium">
            <span className="text-lg">{coffee.id}</span>
          </div>
          
          {/* Rating */}
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-medium">{coffee.rating}</span>
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
