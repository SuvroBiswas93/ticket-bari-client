import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";


const MyBookedTickets = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const res = await axiosSecure.get(`/bookings?userEmail=${user.email}`);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [user?.email, axiosSecure]);

  const handlePayment = async (booking) => {
    const paymentInfo = {
      amount: booking.unitPrice * booking.quantity,
      bookingId: booking._id,
      userEmail: user.email,
      ticketTitle: booking.title,
    };

    const res = await axiosSecure.post("/create-checkout-session", paymentInfo);
    window.location.href = res.data.url;
  };

  if (loading || bookingsLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-teal-700 mb-6">My Booked Tickets</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const departureTime = new Date(booking.departureTime);
            const now = new Date();
            const countdown = Math.max(0, departureTime - now);

            const canPay =
              booking.status === "accepted" && departureTime > now;

            return (
              <div key={booking._id} className="border rounded-lg shadow p-4 flex flex-col justify-between">
                <img
                  src={booking.image}
                  alt={booking.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-semibold">{booking.title}</h3>
                <p>
                  <strong>From:</strong> {booking.from} <br />
                  <strong>To:</strong> {booking.to} <br />
                  <strong>Booking Quantity:</strong> {booking.quantity} <br />
                  <strong>Total Price:</strong> ${booking.unitPrice * booking.quantity} <br />
                  <strong>Departure:</strong> {departureTime.toLocaleString()} <br />
                  <strong>Status:</strong> {booking.status.toUpperCase()} <br />
                  {booking.status !== "rejected" && countdown > 0 && (
                    <span>Countdown: {Math.floor(countdown / 1000 / 60)} minutes</span>
                  )}
                </p>
                {canPay && (
                  <button
                    onClick={() => handlePayment(booking)}
                    className="mt-2 py-2 px-4 bg-teal-600 text-white rounded hover:bg-teal-700"
                  >
                    Pay Now
                  </button>
                )}
                {booking.status === "rejected" && (
                  <p className="mt-2 text-red-600 font-semibold">Booking Rejected</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookedTickets;
