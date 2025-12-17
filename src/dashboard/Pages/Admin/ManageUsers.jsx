import {  use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { User, Mail, Shield, AlertCircle, CheckCircle2, XCircle, Crown } from "lucide-react";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { loading: authLoading } = use(AuthContext);

  const [users, setUsers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  // ================= FETCH ALL USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get("/admins/users");
        setUsers(res.data?.data || []);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchUsers();
  }, [axiosSecure]);

  // ================= UPDATE ROLE =================
  const handleRoleChange = async (userId, role) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Make this user ${role}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.put(`/admins/users/${userId}/role`, { role });

      setUsers(prev =>
        prev.map(user =>
          user._id === userId ? { ...user, role } : user
        )
      );

      Swal.fire("Success!", `User is now ${role}`, "success");
    } catch (error) {
      console.error("Role update failed", error);
      Swal.fire("Error!", "Failed to update role", "error");
    }
  };

  // ================= MARK AS FRAUD =================
  const handleFraud = async (userId, isFraud) => {
    const confirm = await Swal.fire({
      title: "Mark Vendor as Fraud?",
      text: "This will hide all tickets and block future ticket creation.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Mark Fraud",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.put(`/admins/users/${userId}/fraud`, { isFraud });

      setUsers(prev =>
        prev.map(user =>
          user._id === userId ? { ...user, isFraud } : user
        )
      );

      Swal.fire("Success!", `Vendor marked as ${isFraud ? "fraud" : "not fraud"}`, "success");
    } catch (error) {
      console.error("Fraud marking failed", error);
      Swal.fire("Error!", `Failed to mark ${isFraud ? "fraud" : "not fraud"}`, "error");
    }
  };

  if (authLoading || pageLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Manage Users
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage user roles and permissions
          </p>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="mx-auto text-slate-400 mb-4" size={64} />
            <p className="text-xl text-slate-600 dark:text-slate-400 font-semibold">
              No users found
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Users will appear here when they register
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {users.map((user, index) => (
                    <tr 
                      key={user._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="text-slate-500" size={16} />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {user.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="text-slate-500" size={16} />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            user.isFraud
                              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                              : user.role === "admin"
                              ? "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                              : user.role === "vendor"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {user.isFraud ? (
                            <>
                              <XCircle size={12} />
                              Fraud Vendor
                            </>
                          ) : user.role === "admin" ? (
                            <>
                              <Crown size={12} />
                              Admin
                            </>
                          ) : (
                            <>
                              <Shield size={12} />
                              {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"}
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleRoleChange(user._id, "admin")}
                            disabled={user.role === "admin"}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                              user.role === "admin"
                                ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                : "bg-teal-600 hover:bg-teal-700 text-white hover:shadow-md"
                            }`}
                          >
                            <Crown size={16} />
                            Make Admin
                          </button>

                          <button
                            onClick={() => handleRoleChange(user._id, "vendor")}
                            disabled={user.role === "vendor"}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                              user.role === "vendor"
                                ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
                            }`}
                          >
                            <Shield size={16} />
                            Make Vendor
                          </button>

                          {user.role === "vendor" && (
                            <button
                              onClick={() => handleFraud(user._id, !user.isFraud)}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                                user.isFraud
                                  ? "bg-green-600 hover:bg-green-700 text-white hover:shadow-md"
                                  : "bg-red-600 hover:bg-red-700 text-white hover:shadow-md"
                              }`}
                            >
                              {user.isFraud ? (
                                <>
                                  <CheckCircle2 size={16} />
                                  Mark Not Fraud
                                </>
                              ) : (
                                <>
                                  <XCircle size={16} />
                                  Mark Fraud
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
