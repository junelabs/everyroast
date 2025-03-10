
import { useEffect } from "react";
import Header from "@/components/Header";
import ProfileContainer from "@/components/profile/ProfileContainer";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/auth";

const Profile = () => {
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    console.log("Profile page: Authentication state:", { user: !!user, isLoading });
  }, [user, isLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProfileContainer showHeader={false} />
      <Footer />
    </div>
  );
};

export default Profile;
