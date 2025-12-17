import React, { useCallback, useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import useProfile from "../../../hooks/useProfile";

const MyAddedTickets = () => {
  const { loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [profile, isProfileLoading] = useProfile();

  const isFraud = useMemo(() => {
    if (isProfileLoading) return false;
    return profile?.isFraud || false;
  }, [profile?.isFraud, isProfileLoading]);

  // FETCH TICKETS
  const fetchTickets = useCallback(async () => {
    try {
      setTicketsLoading(true);
      const res = await axiosSecure.get(`/tickets/vendor/my-tickets`);
      setTickets(res.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tickets");
    } finally {
      setTicketsLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    if (isProfileLoading) return;
    if (profile?.isFraud) return;
    if(!profile?.email) return;
    fetchTickets();
  }, [isProfileLoading, profile?.isFraud, profile?.email, fetchTickets]);

  // DELETE TICKET 
  const handleDelete = async (id) => {
    if (isFraud) return toast.error("You are marked as fraud. Cannot delete tickets.");
    
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/tickets/${id}`);
        setTickets((prev) => prev.filter((ticket) => ticket._id !== id));
        Swal.fire("Deleted!", "Ticket has been deleted.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "Failed to delete ticket.", "error");
      }
    }
  };

  // LOADING 
  if (loading || ticketsLoading) {
    return <LoadingSpinner />;
  }

  if (isFraud) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.154 0 2.082-.785 2.082-1.75 0-.715-.435-1.333-1.011-1.614a3.5 3.5 0 01-1.805-.874A3.5 3.5 0 0012 8.5a3.5 3.5 0 00-2.482 1.022 3.5 3.5 0 01-1.805.874c-.576.281-1.011.899-1.011 1.614 0 .965.928 1.75 2.082 1.75z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-xl font-bold text-red-800 mb-1">
                Account Restricted
              </h3>
              <p className="text-red-700">
                You are marked as a Fraud Vendor. You cannot add, update, or delete tickets.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------ UI ---------
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          My Added Tickets
        </h2>
        <p className="text-gray-500">
          Manage and update your ticket listings
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tickets added yet.</p>
          <p className="text-gray-400 text-sm mt-2">Start by adding your first ticket!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Image Section */}
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                      ticket.status === "pending"
                        ? "bg-amber-100/90 text-amber-700 border border-amber-200"
                        : ticket.status === "approved"
                        ? "bg-emerald-100/90 text-emerald-700 border border-emerald-200"
                        : "bg-rose-100/90 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {ticket.status?.toUpperCase() || "PENDING"}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col bg-linear-to-b from-white to-gray-50/50">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-700 mb-3 line-clamp-1">
                  {ticket.title}
                </h3>

                {/* Route Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      {ticket.from}
                    </span>
                    <span className="text-gray-300 text-lg">→</span>
                    <span className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      {ticket.to}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-2.5 mb-4 flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Transport:</span>
                    <span className="font-medium text-gray-600">{ticket.transportType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-semibold text-teal-500">${ticket.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Quantity:</span>
                    <span className="font-medium text-gray-600">{ticket.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Departure:</span>
                    <span className="font-medium text-gray-600 text-xs">
                      {new Date(ticket.departureTime).toLocaleDateString()}
                    </span>
                  </div>
                  {ticket.perks?.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-gray-400 text-xs block mb-2">Perks:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {ticket.perks.map((perk, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-teal-50/70 text-teal-600 px-2.5 py-1 rounded-md border border-teal-100"
                          >
                            {perk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2.5">
                  <Link
                    to={`/Dashboard/update-ticket/${ticket._id}`}
                    className={`flex-1 text-center py-2.5 rounded-xl font-medium transition-all ${
                      ticket.status === "rejected" || ticket.status === "approved"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                    }`}
                    onClick={(e) => {
                      if (ticket.status === "rejected" || ticket.status === "approved") {
                        e.preventDefault();
                      }
                    }}
                  >
                    Update
                  </Link>

                  <button
                    onClick={() => handleDelete(ticket._id)}
                    disabled={ticket.status === "rejected" || ticket.status === "approved"}
                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                      ticket.status === "rejected" || ticket.status === "approved"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        : "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:border-rose-300"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAddedTickets;
