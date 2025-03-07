
import { Button } from "@/components/ui/button";

const CommunitySection = () => {
  return (
    <section id="community" className="py-20 bg-roast-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Coffee Community</h2>
          <p className="text-xl text-roast-100 max-w-2xl mx-auto">
            Connect with thousands of coffee enthusiasts sharing their experiences, recommendations, and discoveries.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Community Stats */}
          <div className="bg-roast-800/50 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="text-4xl font-bold mb-2 text-roast-50">37,098+</div>
            <div className="text-xl font-medium mb-4 text-roast-100">Coffee enthusiasts</div>
            <p className="text-roast-200">
              Join a growing community of passionate coffee lovers from around the world.
            </p>
          </div>
          
          {/* Roasters */}
          <div className="bg-roast-800/50 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="text-4xl font-bold mb-2 text-roast-50">1,200+</div>
            <div className="text-xl font-medium mb-4 text-roast-100">Roasters cataloged</div>
            <p className="text-roast-200">
              Discover new roasters and coffees from around the world, reviewed by the community.
            </p>
          </div>
          
          {/* Reviews */}
          <div className="bg-roast-800/50 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="text-4xl font-bold mb-2 text-roast-50">85,000+</div>
            <div className="text-xl font-medium mb-4 text-roast-100">Coffee reviews</div>
            <p className="text-roast-200">
              Read detailed reviews and tasting notes to find your next favorite coffee.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button className="bg-roast-500 hover:bg-roast-600 text-white py-6 px-8 text-lg font-medium rounded-lg">
            Browse Community Updates
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
