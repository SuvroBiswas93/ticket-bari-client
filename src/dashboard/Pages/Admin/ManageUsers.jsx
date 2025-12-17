import {  use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";

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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Manage Users
      </h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-teal-500">
        <table className="table w-full">
          <thead className="bg-teal-500 text-black">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name || "N/A"}</td>
                <td>{user.email}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize
                      ${user.role === "admin" && "bg-green-100 text-green-700"}
                      ${user.role === "vendor" && "bg-blue-100 text-blue-700"}
                      ${user.role === "user" && "bg-gray-100 text-gray-700"}
                      ${user.isFraud && "bg-red-100 text-red-700"}
                    `}
                  >
                    {user.isFraud ? "fraud vendor" : user.role}
                  </span>
                </td>

                <td className="text-center space-x-2">
                  <button
                    onClick={() => handleRoleChange(user._id, "admin")}
                    disabled={user.role === "admin"}
                    className="btn btn-sm btn-success disabled:opacity-40"
                  >
                    Make Admin
                  </button>

                  <button
                    onClick={() => handleRoleChange(user._id, "vendor")}
                    disabled={user.role === "vendor"}
                    className="btn btn-sm btn-info disabled:opacity-40"
                  >
                    Make Vendor
                  </button>

                  {user.role === "vendor"  && (
                    <button
                      onClick={() => handleFraud(user._id, !user.isFraud)}
                      className="btn btn-sm btn-error"
                    >
                      {user.isFraud ? "Mark Not Fraud" : "Mark Fraud"}
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-2xl py-10">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
