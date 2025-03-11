
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Coffee, UtensilsCrossed } from 'lucide-react';

interface ComingSoonProps {
  type: 'cafes' | 'recipes';
}

const ComingSoon: React.FC<ComingSoonProps> = ({ type }) => {
  const title = type === 'cafes' ? 'Cafes' : 'Recipes';
  const description = type === 'cafes' 
    ? 'Discover amazing coffee shops near you and around the world.'
    : 'Explore brewing methods and recipes for your favorite coffees.';
  const icon = type === 'cafes' ? <Coffee className="h-16 w-16" /> : <UtensilsCrossed className="h-16 w-16" />;

  useEffect(() => {
    document.title = `Every Roast | ${title} Coming Soon`;
  }, [title]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto">
          <div className="bg-roast-100 rounded-full h-32 w-32 flex items-center justify-center mx-auto mb-8">
            {icon}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title} Coming Soon</h1>
          
          <p className="text-xl text-gray-600 mb-8">
            {description}
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
              <Calendar className="h-5 w-5 text-roast-500 mr-2" />
              <span className="text-gray-800">Coming Fall 2023</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="text-gray-600">
              We're brewing something special. Sign up now to be the first to know when we launch!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/">Return Home</Link>
              </Button>
              <Button asChild className="bg-roast-500 hover:bg-roast-600">
                <Link to="/signup">Sign Up for Updates</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComingSoon;
