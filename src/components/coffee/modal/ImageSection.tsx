
import React from 'react';

interface ImageSectionProps {
  imageSrc: string;
  altText: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ imageSrc, altText }) => {
  return (
    <div className="relative h-64 md:h-full">
      <img 
        src={imageSrc} 
        alt={altText} 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ImageSection;
