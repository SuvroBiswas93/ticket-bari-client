// useRole.jsx
import { use, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";
import { toast } from "react-toastify";

const useRole = () => {
  const { user, loading } = use(AuthContext);
  const axiosSecure = useAxiosSecure()

  const [role, setRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    if (loading) return;           
    if (!user?.email) return;      

    const fetchRole = async () => {
      setIsRoleLoading(true);
      try {
        // const result = await axiosSecure(`/user/role?email=${user.email}`);
        const result = await new Promise((resolve)=> {
          resolve( {
            data: {
              role: "vendor",
            }
          });
        });   
        console.log(result, "result")
        setRole(result.data.role);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || "Failed to fetch role")
        setRole(null);
      } finally {
        setIsRoleLoading(false);
      }
    };

    fetchRole();
  }, [user, loading, axiosSecure]);

  return [role, isRoleLoading];
};

export default useRole;
