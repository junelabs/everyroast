
import React from 'react';

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
  console.log('Type value type:', typeof type);
  
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Attribute label="Origin" value={origin} />
        <Attribute label="Price" value={`$${price.toFixed(2)}`} />
        <Attribute label="Roast Level" value={roastLevel} />
        <Attribute label="Process" value={processMethod} />
        
        {/* Always display the Type attribute when it exists */}
        {type && (
          <Attribute label="Type" value={type} />
        )}
      </div>
    </>
  );
};

export default CoffeeAttributes;
