
import { useEffect } from "react";
import Header from "@/components/Header";
import ProfileContainer from "@/components/profile/ProfileContainer";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Profile page: Authentication state:", { user: !!user, isLoading });
    
    // If not authenticated and not loading, redirect to login
    if (!user && !isLoading) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access your profile"
      });
      navigate('/login');
    }
  }, [user, isLoading, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <ProfileContainer showHeader={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
