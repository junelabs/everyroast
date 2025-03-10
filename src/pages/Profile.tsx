
import Header from "@/components/Header";
import ProfileContainer from "@/components/profile/ProfileContainer";
import Footer from "@/components/Footer";

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProfileContainer showHeader={false} />
      <Footer />
    </div>
  );
};

export default Profile;
