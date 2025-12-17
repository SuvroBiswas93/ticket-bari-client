import { use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";


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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Manage Tickets
      </h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-teal-500">
        <table className="table w-full">
          <thead className="bg-teal-500 text-black">
            <tr>
              <th>#</th>
              <th>Ticket Title</th>
              <th>Vendor</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id}>
                <td>{index + 1}</td>
                <td className="font-medium">{ticket.title}</td>
                <td>
                  <p>{ticket.vendorName}</p>
                  <p className="text-xs text-gray-500">
                    {ticket.vendorEmail}
                  </p>
                </td>
                <td>৳ {ticket.price}</td>
                <td>{ticket.totalQuantity}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize
                      ${
                        ticket.verificationStatus === "pending" &&
                        "bg-yellow-100 text-yellow-700"
                      }
                      ${
                        ticket.verificationStatus === "approved" &&
                        "bg-green-100 text-green-700"
                      }
                      ${
                        ticket.verificationStatus === "rejected" &&
                        "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {ticket.verificationStatus}
                  </span>
                </td>

                <td className="text-center space-x-2">
                  {
                     ["pending", "rejected"].includes(ticket.verificationStatus) && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(ticket._id, "approved")
                          }
                          className="btn btn-sm btn-success disabled:opacity-40"
                        >
                          Approve
                        </button>
                      </>
                    )
                  }

                  { ["pending", "approved"].includes(ticket.verificationStatus) && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(ticket._id, "rejected")
                        }
                        className="btn btn-sm btn-error disabled:opacity-40"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {tickets.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-2xl text-black">
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTickets;
