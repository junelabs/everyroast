
import React from 'react';

const FilterTabs: React.FC = () => {
  return (
    <div className="mb-8 border-b border-roast-200">
      <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide">
        <div className="text-roast-800 font-medium whitespace-nowrap border-b-2 border-roast-500 pb-4 -mb-4">Popular</div>
        <div className="text-roast-500 whitespace-nowrap">My Community</div>
      </div>
    </div>
  );
};

export default FilterTabs;
