
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/context/auth/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileTabs from "@/components/profile/ProfileTabs";

const PublicProfileView = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data as Profile);
        } else {
          setError("User profile not found");
          toast({
            title: "Profile not found",
            description: "We couldn't find this user profile.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setError(error.message || "Failed to load profile");
        toast({
          title: "Error",
          description: "Failed to load user profile.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, toast]);

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 text-center">
        <div className="text-xl font-semibold text-gray-700">
          {error || "User profile not found"}
        </div>
        <p className="text-gray-500 mt-2">
          The profile you're looking for doesn't exist or you don't have permission to view it.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        {/* Profile Image */}
        <div className="relative">
          <Avatar className="h-32 w-32">
            {profile.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.username || "User"} />
            ) : (
              <AvatarFallback className="text-3xl">
                {(profile.username?.[0] || profile.full_name?.[0] || "U").toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {profile.full_name || profile.username || "Anonymous User"}
          </h1>
          <p className="text-gray-600 mb-4">@{profile.username}</p>
          
          {profile.bio && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Bio</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <ProfileTabs viewingUserId={userId} />
    </div>
  );
};

export default PublicProfileView;
