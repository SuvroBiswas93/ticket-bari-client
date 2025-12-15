import { useEffect, useMemo, useState, use } from "react";
import { useParams, Navigate } from "react-router";
import { MapPin, Users, Bus, Calendar, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

const TicketDetails = () => {
  const { id } = useParams();
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
        setTicket(res.data);
      } catch {
        toast.error("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, axiosSecure]);

  /* ================= COUNTDOWN ================= */
  const countdown = useMemo(() => {
    if (!ticket?.departureDateTime) return null;

    const diff = new Date(ticket.departureDateTime) - new Date();
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    return `${days}d ${hrs}h ${mins}m`;
  }, [ticket]);

  /* ================= CONDITIONAL UI ================= */
  if (!authLoading && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (loading || authLoading) {
    return <LoadingSpinner />;
  }

  if (!ticket) {
    return (
      <div className="text-center py-20 text-red-500">
        Ticket not found
      </div>
    );
  }

  const isExpired = new Date(ticket.departureDateTime) < new Date();
  const isSoldOut = ticket.quantity === 0;

  /* ================= BOOKING ================= */
  const handleBooking = async () => {
    if (quantity > ticket.quantity) {
      return toast.error("Quantity exceeds available tickets");
    }

    try {
      await axiosSecure.post("/bookings", {
        ticketId: ticket._id,
        quantity,
      });

      toast.success("Booking request submitted!");
      setShowModal(false);
    } catch {
      toast.error("Booking failed");
    }
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-teal-50 to-white dark:from-slate-900 dark:to-slate-800 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src={ticket.image}
            alt={ticket.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6"
        >
          <h1 className="text-3xl font-bold mb-4">{ticket.title}</h1>

          <div className="flex items-center gap-2 mb-3">
            <MapPin className="text-teal-600" />
            <span>{ticket.from} → {ticket.to}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="flex items-center gap-2"><Bus /> {ticket.transportType}</div>
            <div className="flex items-center gap-2"><Users /> {ticket.quantity} left</div>
            <div className="flex items-center gap-2"><Calendar /> {ticket.departureDateTime}</div>
            <div className="flex items-center gap-2"><ShieldCheck /> Verified Vendor</div>
          </div>

          {/* COUNTDOWN */}
          {countdown ? (
            <div className="mb-4 p-3 rounded-xl bg-teal-100 text-teal-700 font-semibold">
              Departure in {countdown}
            </div>
          ) : (
            <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-600 font-semibold">
              Departure time passed
            </div>
          )}

          {/* PERKS */}
          <div className="flex flex-wrap gap-2 mb-6">
            {ticket.perks?.map((perk, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs rounded-full bg-teal-50 text-teal-700"
              >
                {perk}
              </span>
            ))}
          </div>

          {/* PRICE + CTA */}
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-sm text-gray-500">Price per ticket</p>
              <p className="text-3xl font-bold text-teal-600">৳ {ticket.price}</p>
            </div>

            <button
              disabled={isExpired || isSoldOut}
              onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 text-white disabled:opacity-50"
            >
              Book Now
            </button>
          </div>
        </motion.div>
      </div>

      {/* BOOKING MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Book Ticket</h3>

            <input
              type="number"
              min={1}
              max={ticket.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn">
                Cancel
              </button>
              <button onClick={handleBooking} className="btn btn-success">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TicketDetails;
