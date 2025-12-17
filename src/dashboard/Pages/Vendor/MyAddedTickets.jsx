import React, { useCallback, useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Package, PackageCheck, AlertTriangle, Calendar, Bus, DollarSign } from "lucide-react";

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
    
    // If fraud or no email, stop loading but don't fetch
    if (profile?.isFraud || !profile?.email) {
      setTicketsLoading(false);
      return;
    }
    
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
    <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          My Added Tickets
        </h2>
        <p className="text-gray-500 dark:text-slate-400">
          Manage and update your ticket listings
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-slate-400 text-lg">No tickets added yet.</p>
          <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">Start by adding your first ticket!</p>
        </div>
      ) : (
        <div className="space-y-20">
          {Array.from({ length: Math.ceil(tickets.length / 3) }).map((_, rowIndex) => {
            const rowTickets = tickets.slice(rowIndex * 3, rowIndex * 3 + 3);
            return (
              <React.Fragment key={rowIndex}>
                {rowIndex > 0 && (
                  <div className="relative -my-10">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white dark:bg-slate-900 px-6 text-slate-400 dark:text-slate-500 text-lg">
                        • • •
                      </span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rowTickets.map((ticket) => (
                    <div
                      key={ticket._id}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Image Section */}
              <div className="relative overflow-hidden bg-gray-50 dark:bg-slate-800">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                      ticket.verificationStatus === "pending"
                        ? "bg-amber-100/90 text-amber-700 border border-amber-200"
                        : ticket.verificationStatus === "approved"
                        ? "bg-emerald-100/90 text-emerald-700 border border-emerald-200"
                        : "bg-rose-100/90 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {ticket.verificationStatus?.toUpperCase() || "PENDING"}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col bg-linear-to-b from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/50">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-3 line-clamp-1">
                  {ticket.title}
                </h3>

                {/* Route Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700">
                      {ticket.from}
                    </span>
                    <span className="text-gray-300 dark:text-slate-600 text-lg">→</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700">
                      {ticket.to}
                    </span>
                  </div>
                </div>

                {/* Availability Status - Prominent Display */}
                <div className="mb-4 p-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Availability Status
                    </span>
                    {ticket.availableQuantity === 0 ? (
                      <AlertTriangle className="text-red-500" size={16} />
                    ) : ticket.availableQuantity <= 5 ? (
                      <AlertTriangle className="text-amber-500" size={16} />
                    ) : (
                      <PackageCheck className="text-green-500" size={16} />
                    )}
                  </div>
                  <div className="flex items-baseline gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className={`${
                          ticket.availableQuantity === 0 
                            ? "text-red-500" 
                            : ticket.availableQuantity <= 5 
                            ? "text-amber-500" 
                            : "text-green-500"
                        }`} size={18} />
                        <span className="text-xs text-slate-500 dark:text-slate-400">Available</span>
                      </div>
                      <div className={`text-2xl font-bold ${
                        ticket.availableQuantity === 0 
                          ? "text-red-600 dark:text-red-400" 
                          : ticket.availableQuantity <= 5 
                          ? "text-amber-600 dark:text-amber-400" 
                          : "text-green-600 dark:text-green-400"
                      }`}>
                        {ticket.availableQuantity || 0}
                      </div>
                    </div>
                    <div className="text-right border-l border-slate-300 dark:border-slate-600 pl-3">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total</div>
                      <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                        {ticket.totalQuantity || ticket.quantity || 0}
                      </div>
                    </div>
                  </div>
                  {ticket.availableQuantity === 0 && (
                    <div className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                      Sold Out
                    </div>
                  )}
                  {ticket.availableQuantity > 0 && ticket.availableQuantity <= 5 && (
                    <div className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                      Low Stock
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-3 mb-4 flex-1">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Bus className="text-blue-600 dark:text-blue-400" size={16} />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Transport
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {ticket.transportType}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                          <DollarSign className="text-teal-600 dark:text-teal-400" size={16} />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Price
                        </span>
                      </div>
                      <span className="text-base font-bold text-teal-600 dark:text-teal-400">
                        ৳ {ticket.price?.toLocaleString() || ticket.price}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Calendar className="text-purple-600 dark:text-purple-400" size={16} />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Departure
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {new Date(ticket.departureTime).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        <span className="text-slate-600 dark:text-slate-400">
                          {new Date(ticket.departureTime).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Perks */}
                {ticket.perks?.length > 0 && (
                  <div className="mb-4 pt-3 border-t border-gray-100 dark:border-slate-700">
                    <span className="text-gray-400 dark:text-slate-300 text-xs font-semibold uppercase tracking-wide block mb-2">Perks:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {ticket.perks.map((perk, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium bg-teal-50/70 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 px-2.5 py-1 rounded-md border border-teal-100 dark:border-teal-500/30"
                        >
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 flex gap-2.5">
                  <Link
                    to={`/Dashboard/update-ticket/${ticket._id}`}
                    className={`flex-1 text-center py-2.5 rounded-xl font-medium transition-all ${
                      ticket.verificationStatus === "rejected" || ticket.verificationStatus === "approved"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                    }`}
                    onClick={(e) => {
                      if (ticket.verificationStatus === "rejected" || ticket.verificationStatus === "approved") {
                        e.preventDefault();
                      }
                    }}
                  >
                    Update
                  </Link>

                  <button
                    onClick={() => handleDelete(ticket._id)}
                    disabled={ticket.verificationStatus === "rejected" || ticket.verificationStatus === "approved"}
                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                      ticket.verificationStatus === "rejected" || ticket.verificationStatus === "approved"
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
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAddedTickets;
