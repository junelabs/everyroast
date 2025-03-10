
import React from 'react';
import { getRoastLevelEmoji, getProcessMethodEmoji } from '@/utils/coffeeUtils';

interface AttributeProps {
  label: string;
  value: React.ReactNode;
}

const Attribute: React.FC<AttributeProps> = ({ label, value }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
};

interface CoffeeAttributesProps {
  origin: string;
  price: number;
  roastLevel: string;
  processMethod: string;
  type?: string;
}

const CoffeeAttributes: React.FC<CoffeeAttributesProps> = ({
  origin,
  price,
  roastLevel,
  processMethod,
  type
}) => {
  // Enhanced debug logging for the type value
  console.log('Type value in CoffeeAttributes:', type);
  console.log('Type value length:', type ? type.length : 0);
  console.log('Type value is empty string?', type === '');
  
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Attribute label="Origin" value={origin} />
        <Attribute label="Price" value={`$${price.toFixed(2)}`} />
        <Attribute 
          label="Roast Level" 
          value={
            <div className="flex items-center">
              <span className="mr-1">{getRoastLevelEmoji(roastLevel)}</span>
              {roastLevel}
            </div>
          }
        />
        <Attribute 
          label="Process" 
          value={
            <div className="flex items-center">
              <span className="mr-1">{getProcessMethodEmoji(processMethod)}</span>
              {processMethod}
            </div>
          }
        />
        
        {/* Only show Type if it has a valid value */}
        {type && type.trim() !== "" && (
          <Attribute label="Type" value={type} />
        )}
      </div>
    </>
  );
};

export default CoffeeAttributes;
