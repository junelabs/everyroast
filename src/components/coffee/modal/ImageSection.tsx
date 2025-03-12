
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Maximize2 } from 'lucide-react';

interface ImageSectionProps {
  imageSrc: string;
  altText: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ imageSrc, altText }) => {
  const [isFullView, setIsFullView] = useState(false);

  return (
    <>
      <div className="relative h-72 md:h-72 group">
        <img 
          src={imageSrc} 
          alt={altText} 
          className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none cursor-pointer"
          onClick={() => setIsFullView(true)}
        />
        <button 
          className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={() => setIsFullView(true)}
          aria-label="View full image"
        >
          <Maximize2 size={16} />
        </button>
        <button 
          className="absolute bottom-3 right-3 bg-black/50 text-white p-2 rounded-full"
          onClick={() => setIsFullView(true)}
          aria-label="View full image"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <Dialog open={isFullView} onOpenChange={setIsFullView}>
        <DialogContent className="p-0 max-w-4xl w-auto md:w-auto h-auto flex items-center justify-center bg-transparent">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={imageSrc} 
              alt={altText} 
              className="max-w-full max-h-[80vh] object-contain rounded-md" 
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageSection;
