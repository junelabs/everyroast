
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface LoadMoreButtonProps {
  isVisible: boolean;
  isAuthenticated: boolean;
  onLoadMore: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ 
  isVisible, 
  isAuthenticated, 
  onLoadMore 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view more coffees.",
        variant: "default"
      });
      navigate('/login');
      return;
    }
    
    onLoadMore();
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="mt-12 text-center">
      <Button 
        className={`rounded-full px-8 py-4 border border-roast-300 ${!isAuthenticated ? 'bg-roast-500 text-white hover:bg-roast-600' : 'text-roast-800 hover:bg-roast-100'} text-lg font-medium`}
        onClick={handleClick}
      >
        {isAuthenticated ? 'Load More Coffees' : 'Sign In to See More'}
      </Button>
    </div>
  );
};

export default LoadMoreButton;
