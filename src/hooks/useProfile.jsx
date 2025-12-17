
import { use, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";
import { toast } from "react-toastify";

const useProfile = () => {
  const { user, loading, } = use(AuthContext);
  const axiosSecure = useAxiosSecure()
 
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    if (loading) return;           
    if (!user?.email) return;      

    const fetchProfile = async () => {
      setIsProfileLoading(true);
      try {
        const result = await axiosSecure(`/auth/me`);
        console.log(result, "result")
        setProfile(result.data?.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || "Failed to fetch role")
        setProfile(null);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user, loading, axiosSecure]);

  return [profile, isProfileLoading];
};

export default useProfile;
