
import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface ImageSectionProps {
  imageSrc: string;
  altText: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ imageSrc, altText }) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  // Don't render anything if no image provided
  if (!imageSrc) {
    return null;
  }

  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-lg flex-shrink-0">
      <div 
        className="w-full h-full cursor-pointer relative"
        onClick={() => setFullscreenOpen(true)}
      >
        <img 
          src={imageSrc} 
          alt={altText} 
          className="w-full h-full object-cover"
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-2 right-2 bg-black/40 p-1 rounded-full hover:bg-black/60 transition-colors">
                <Maximize2 className="h-3 w-3 text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>View full image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-[85vw] p-0 border-none bg-transparent shadow-none overflow-hidden">
          <div className="relative flex items-center justify-center">
            <img 
              src={imageSrc} 
              alt={altText} 
              className="max-h-[85vh] max-w-full object-contain"
            />
            <DialogClose className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white hover:bg-black/80">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageSection;
