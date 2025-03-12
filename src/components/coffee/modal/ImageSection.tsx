
import React from 'react';

interface ImageSectionProps {
  imageSrc: string;
  altText: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ imageSrc, altText }) => {
  return (
    <div className="relative h-72 md:h-full">
      <img 
        src={imageSrc} 
        alt={altText} 
        className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
      />
    </div>
  );
};

export default ImageSection;
