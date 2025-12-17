import { use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { CheckCircle2, XCircle, AlertCircle, User, Mail, Ticket } from "lucide-react";


const ManageTickets = () => {
  const axiosSecure = useAxiosSecure();

  const [tickets, setTickets] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const {loading} = use(AuthContext)

  // ================= FETCH ALL TICKETS =================
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axiosSecure.get("/admins/tickets/all");
        setTickets(res.data?.data || []);
      } catch (error) {
        console.error("Failed to load tickets", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchTickets();
  }, [axiosSecure]);

  // ================= UPDATE STATUS =================
  const handleStatusUpdate = async (ticketId, status) => {
    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${status} this ticket`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.put(`/admins/tickets/${ticketId}/verify`, { status });

      setTickets((prev) =>
        prev.map((ticket) =>
        {
          if(ticket._id === ticketId) {
            return { ...ticket, verificationStatus: status }
          }
          return ticket
        }
        )
      );

      Swal.fire("Success!", `Ticket ${status} successfully`, "success");
    } catch (error) {
      console.error("Status update failed", error);
      Swal.fire("Error!", "Something went wrong", "error");
    }
  };

 
  if (loading || pageLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Manage Tickets
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Review and manage ticket verification status
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="mx-auto text-slate-400 mb-4" size={64} />
            <p className="text-xl text-slate-600 dark:text-slate-400 font-semibold">
              No tickets found
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Tickets will appear here when vendors add them
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
                      Ticket Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {tickets.map((ticket, index) => (
                    <tr 
                      key={ticket._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Ticket className="text-slate-500" size={16} />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {ticket.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="text-slate-500" size={14} />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {ticket.vendorName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="text-slate-500" size={14} />
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {ticket.vendorEmail}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                          ৳ {ticket.price?.toLocaleString() || ticket.price}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {ticket.totalQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.verificationStatus === "pending"
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                              : ticket.verificationStatus === "approved"
                              ? "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {ticket.verificationStatus === "approved" && <CheckCircle2 size={12} />}
                          {ticket.verificationStatus === "rejected" && <XCircle size={12} />}
                          {ticket.verificationStatus.charAt(0).toUpperCase() + ticket.verificationStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {["pending", "rejected"].includes(ticket.verificationStatus) && (
                            <button
                              onClick={() => handleStatusUpdate(ticket._id, "approved")}
                              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white hover:shadow-md"
                            >
                              <CheckCircle2 size={16} />
                              Approve
                            </button>
                          )}

                          {["pending", "approved"].includes(ticket.verificationStatus) && (
                            <button
                              onClick={() => handleStatusUpdate(ticket._id, "rejected")}
                              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white hover:shadow-md"
                            >
                              <XCircle size={16} />
                              Reject
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

export default ManageTickets;
