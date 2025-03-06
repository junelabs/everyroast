
import { CupSoda, Users, Map, BarChart3, MessageSquare } from "lucide-react";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="bg-coffee-100 p-3 rounded-lg inline-block mb-4">
        <Icon className="h-6 w-6 text-coffee-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-coffee-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: CupSoda,
      title: "Log Your Coffee",
      description: "Keep a detailed record of every coffee you try with tasting notes, ratings, and photos."
    },
    {
      icon: Users,
      title: "Connect Community",
      description: "Find and follow other coffee enthusiasts, share recommendations, and discuss favorites."
    },
    {
      icon: Map,
      title: "Discover Roasters",
      description: "Explore coffee roasters worldwide and get recommendations based on your taste preferences."
    },
    {
      icon: BarChart3,
      title: "Taste Analytics",
      description: "Visualize your coffee journey with beautiful charts showing your preferences over time."
    },
    {
      icon: MessageSquare,
      title: "Coffee Discussions",
      description: "Participate in discussions about brewing methods, equipment, and coffee origins."
    }
  ];

  return (
    <section id="features" className="py-20 bg-coffee-100/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-4">Record Your Coffee Journey</h2>
          <p className="text-xl text-coffee-600 max-w-2xl mx-auto">
            From your morning brew to special coffee experiences, track your entire coffee journey in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
