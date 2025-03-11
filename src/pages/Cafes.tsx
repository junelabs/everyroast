
import React, { useEffect } from 'react';
import ComingSoon from './ComingSoon';

const Cafes = () => {
  useEffect(() => {
    document.title = "Every Roast | Cafes";
  }, []);

  return <ComingSoon type="cafes" />;
};

export default Cafes;
