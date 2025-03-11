
import React, { useEffect } from 'react';
import ComingSoon from './ComingSoon';

const Recipes = () => {
  useEffect(() => {
    document.title = "Every Roast | Recipes";
  }, []);

  return <ComingSoon type="recipes" />;
};

export default Recipes;
