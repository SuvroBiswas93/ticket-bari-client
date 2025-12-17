import { useEffect, useMemo, useState, use } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { 
  MapPin, 
  Users, 
  Bus, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Mail, 
  X,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = use(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  /* ================= FETCH TICKET ================= */
  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        const res = await axiosSecure.get(`/tickets/${id}`);
        setTicket(res.data?.data || res.data);
      } catch {
        toast.error("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, axiosSecure]);

  /* ================= FORMAT DATE ================= */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ================= COUNTDOWN ================= */
  const countdown = useMemo(() => {
    if (!ticket?.departureTime) return null;

    const diff = new Date(ticket.departureTime) - new Date();
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    return { days, hrs, mins };
  }, [ticket]);

  /* ================= CONDITIONAL UI ================= */
  if (loading || authLoading) {
    return <LoadingSpinner />;
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-xl text-red-500 font-semibold">Ticket not found</p>
        </div>
      </div>
    );
  }

  const isExpired = new Date(ticket.departureTime) < new Date();
  const isSoldOut = ticket.availableQuantity === 0;
  const isAvailable = ticket.isActive && ticket.verificationStatus === "approved";
  const totalPrice = quantity * ticket.price;

  /* ================= HANDLE BOOK NOW CLICK ================= */
  const handleBookNowClick = () => {
    // Show the booking modal
    setShowModal(true);
  };

  /* ================= BOOKING ================= */
  const handleBooking = async () => {
    // Check if user is logged in
    if (!user) {
      // Close modal and redirect to login with current pathname as state for redirect after login
      setShowModal(false);
      navigate("/auth/login", { state: location.pathname });
      toast.info("Please login to book tickets");
      return;
    }

    if (quantity > ticket.availableQuantity) {
      return toast.error("Quantity exceeds available tickets");
    }

    if (quantity < 1) {
      return toast.error("Please select at least 1 ticket");
    }

    // Optimistically update the ticket state
    const previousTicket = { ...ticket };
    setTicket({
      ...ticket,
      availableQuantity: ticket.availableQuantity - quantity,
    });

    try {
      await axiosSecure.post("/bookings", {
        ticketId: ticket._id,
        bookingQuantity: quantity,
      });

      toast.success("Booking request submitted successfully!");
      setShowModal(false);
      setQuantity(1);
    } catch (err) {
      // Revert optimistic update on error
      setTicket(previousTicket);
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-slate-50 via-teal-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Status Badge */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              {ticket.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-semibold">
                <MapPin size={16} />
                {ticket.from} → {ticket.to}
              </span>
              {ticket.isAdvertised && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold">
                  <TrendingUp size={16} />
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-full object-cover"
                />
                {!isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white">
                      <AlertCircle className="mx-auto mb-2" size={48} />
                      <p className="text-xl font-bold">
                        {ticket.verificationStatus === "pending" && "Pending Approval"}
                        {ticket.verificationStatus === "rejected" && "Rejected"}
                        {!ticket.isActive && "Inactive"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ticket Information Grid */}
              <div className="p-6 space-y-6">
                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <Bus className="text-teal-600 mb-2" size={24} />
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Transport</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{ticket.transportType}</p>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <Users className="text-teal-600 mb-2" size={24} />
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Available</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{ticket.availableQuantity}</p>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <Calendar className="text-teal-600 mb-2" size={24} />
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{ticket.totalQuantity}</p>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <ShieldCheck className="text-teal-600 mb-2" size={24} />
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Status</p>
                    <p className="font-semibold text-slate-900 dark:text-white capitalize">{ticket.verificationStatus}</p>
                  </div>
                </div>

                {/* Departure Time */}
                <div className="p-4 rounded-xl bg-linear-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200 dark:border-teal-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="text-teal-600" size={20} />
                    <p className="font-semibold text-slate-900 dark:text-white">Departure Time</p>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 ml-8">{formatDate(ticket.departureTime)}</p>
                  
                  {countdown && (
                    <div className="mt-4 ml-8 flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-teal-600">{countdown.days}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Days</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-teal-600">{countdown.hrs}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Hours</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-teal-600">{countdown.mins}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Minutes</p>
                      </div>
                    </div>
                  )}
                  {!countdown && !isExpired && (
                    <p className="mt-2 ml-8 text-sm text-amber-600 dark:text-amber-400">Departure time not set</p>
                  )}
                  {isExpired && (
                    <p className="mt-2 ml-8 text-sm text-red-600 dark:text-red-400 font-semibold">⚠️ Departure time has passed</p>
                  )}
                </div>

                {/* Perks */}
                {ticket.perks && ticket.perks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Amenities & Perks</h3>
                    <div className="flex flex-wrap gap-2">
                      {ticket.perks.map((perk, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium"
                        >
                          <CheckCircle2 size={16} />
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vendor Information */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Vendor Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-teal-600" size={18} />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{ticket.vendorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="text-slate-500" size={18} />
                      <span className="text-slate-600 dark:text-slate-400 text-sm">{ticket.vendorEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 sticky top-6">
              <div className="mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Price per ticket</p>
                <p className="text-4xl font-bold text-teal-600 mb-4">৳ {ticket.price.toLocaleString()}</p>
                
                {isSoldOut && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
                    <p className="text-sm text-red-600 dark:text-red-400 font-semibold">Sold Out</p>
                  </div>
                )}
                
                {!isAvailable && !isSoldOut && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-4">
                    <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold">
                      {ticket.verificationStatus === "pending" && "Awaiting Approval"}
                      {ticket.verificationStatus === "rejected" && "Not Available"}
                      {!ticket.isActive && "Currently Inactive"}
                    </p>
                  </div>
                )}
              </div>

              <button
                disabled={isExpired || isSoldOut || !isAvailable}
                onClick={handleBookNowClick}
                className="w-full px-6 py-4 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 text-white font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isExpired ? "Expired" : isSoldOut ? "Sold Out" : !isAvailable ? "Not Available" : "Book Now"}
              </button>

              {ticket.availableQuantity > 0 && (
                <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
                  {ticket.availableQuantity} ticket{ticket.availableQuantity !== 1 ? "s" : ""} available
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Book Tickets</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <X className="text-slate-600 dark:text-slate-400" size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Number of Tickets
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={ticket.availableQuantity}
                      value={quantity}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(ticket.availableQuantity, Number(e.target.value) || 1));
                        setQuantity(val);
                      }}
                      className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(ticket.availableQuantity, quantity + 1))}
                      className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Maximum {ticket.availableQuantity} ticket{ticket.availableQuantity !== 1 ? "s" : ""} available
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Price per ticket</span>
                    <span className="font-semibold text-slate-900 dark:text-white">৳ {ticket.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Quantity</span>
                    <span className="font-semibold text-slate-900 dark:text-white">× {quantity}</span>
                  </div>
                  <div className="border-t border-slate-300 dark:border-slate-600 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-teal-600">৳ {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TicketDetails;
