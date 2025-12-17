import React, { useState, useEffect, useContext, } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import { 
  MapPin, 
  Users, 
  Bus, 
  Calendar, 
  Clock, 
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

const MyBookedTickets = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const res = await axiosSecure.get(`/bookings/user/my-bookings`);
        setBookings(res.data?.data || []);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [user?.email, axiosSecure]);

  const handlePayment = async (booking) => {
    setProcessingPayment(booking._id);
    try {
      const paymentInfo = {
        bookingId: booking._id,
      };

      const res = await axiosSecure.post("/payments/create-checkout-session", paymentInfo);
      window.location.href = res.data?.data?.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
      setProcessingPayment(null);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      accepted: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
      rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
      paid: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    };
    return styles[status] || styles.pending;
  };

  // Get payment status badge styling
  const getPaymentStatusBadge = (paymentStatus) => {
    const styles = {
      pending: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
      paid: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    };
    return styles[paymentStatus] || styles.pending;
  };

  if (loading || bookingsLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            My Booked Tickets
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage and track your ticket bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="mx-auto text-slate-400 mb-4" size={64} />
            <p className="text-xl text-slate-600 dark:text-slate-400 font-semibold">
              No bookings yet
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Start booking tickets to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const departureTime = new Date(booking.departureTime);
              const now = new Date();
              const isExpired = departureTime < now;
              const countdown = Math.max(0, departureTime - now);
              
              const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
              const hrs = Math.floor((countdown / (1000 * 60 * 60)) % 24);
              const mins = Math.floor((countdown / (1000 * 60)) % 60);

              const canPay = 
                booking.status === "accepted" && 
                booking.paymentStatus === "pending" && 
                !isExpired;

              return (
                <div
                  key={booking._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.ticketTitle}
                      className="w-full h-full object-cover"
                    />
                    {/* Status Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      {booking.paymentStatus === "paid" && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusBadge(
                            booking.paymentStatus
                          )}`}
                        >
                          Paid
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2">
                      {booking.ticketTitle}
                    </h3>

                    {/* Route */}
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="text-teal-600 shrink-0" size={18} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {booking.from} → {booking.to}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Bus className="text-slate-500 shrink-0" size={16} />
                        <span className="text-slate-600 dark:text-slate-400">
                          {booking.transportType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Users className="text-slate-500 shrink-0" size={16} />
                        <span className="text-slate-600 dark:text-slate-400">
                          {booking.bookingQuantity} ticket{booking.bookingQuantity !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="text-slate-500 shrink-0" size={16} />
                        <span className="text-slate-600 dark:text-slate-400">
                          {formatDate(booking.departureTime)}
                        </span>
                      </div>

                      {/* Countdown */}
                      {!isExpired && countdown > 0 && booking.status !== "rejected" && (
                        <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                          <Clock className="text-teal-600 shrink-0" size={16} />
                          <span className="text-teal-700 dark:text-teal-300 font-medium">
                            {days > 0 && `${days}d `}
                            {hrs > 0 && `${hrs}h `}
                            {mins > 0 && `${mins}m`} left
                          </span>
                        </div>
                      )}

                      {isExpired && (
                        <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                          <XCircle className="text-red-600 shrink-0" size={16} />
                          <span className="text-red-700 dark:text-red-300 font-medium">
                            Departure time passed
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Total Price
                        </span>
                        <span className="text-2xl font-bold text-teal-600">
                          ৳ {booking.totalPrice?.toLocaleString() || booking.totalPrice}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      {canPay && (
                        <button
                          onClick={() => handlePayment(booking)}
                          disabled={processingPayment === booking._id}
                          className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {processingPayment === booking._id ? (
                            <>
                              <Loader2 className="animate-spin" size={18} />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard size={18} />
                              Pay Now
                            </>
                          )}
                        </button>
                      )}

                      {booking.paymentStatus === "paid" && (
                        <div className="w-full px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center justify-center gap-2">
                          <CheckCircle2 className="text-green-600" size={18} />
                          <span className="text-green-700 dark:text-green-300 font-semibold">
                            Payment Completed
                          </span>
                        </div>
                      )}

                      {booking.status === "rejected" && (
                        <div className="w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
                          <XCircle className="text-red-600" size={18} />
                          <span className="text-red-700 dark:text-red-300 font-semibold">
                            Booking Rejected
                          </span>
                        </div>
                      )}

                      {booking.status === "pending" && (
                        <div className="w-full px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center justify-center gap-2">
                          <Clock className="text-amber-600" size={18} />
                          <span className="text-amber-700 dark:text-amber-300 font-semibold">
                            Awaiting Approval
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookedTickets;
