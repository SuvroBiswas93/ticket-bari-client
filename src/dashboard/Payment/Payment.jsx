import React, { , useEffect, useState, useCallback, use } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const Payment = () => {
  const { bookingId } = useParams(); 
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { loading } = use(AuthContext);

  const [booking, setBooking] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  //  Fetch booking data
  const fetchBooking = useCallback(async () => {
    try {
      const res = await axiosSecure.get(`/bookings/${bookingId}`);
      setBooking(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load booking information");
    } finally {
      setPageLoading(false);
    }
  }, [axiosSecure, bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  // Handle Stripe payment
  const handlePayment = async () => {
    if (!booking) return;

    // Safety checks
    if (booking.status !== "accepted") {
      toast.error("Payment is not allowed for this booking");
      return;
    }

    const departureTime = new Date(booking.departureDateTime);
    if (departureTime < new Date()) {
      toast.error("Departure time has already passed");
      return;
    }

    const paymentInfo = {
      bookingId: booking._id,
      ticketId: booking.ticketId,
      ticketTitle: booking.ticketTitle,
      quantity: booking.quantity,
      unitPrice: booking.unitPrice,
      totalPrice: booking.totalPrice,
      userEmail: booking.userEmail,
      vendorEmail: booking.vendorEmail,
    };

    try {
      const res = await axiosSecure.post(
        "/create-checkout-session",
        paymentInfo
      );

      // 🔁 Redirect to Stripe Checkout
      window.location.href = res.data.url;
    } catch (error) {
      console.error(error);
      toast.error("Payment initialization failed");
    }
  };

  // 🔹 Loading UI
  if (loading || pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (!booking) {
    return <p className="text-center text-red-500">Booking not found</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>

      <div className="space-y-2 text-gray-700">
        <p>
          <strong>Ticket:</strong> {booking.ticketTitle}
        </p>
        <p>
          <strong>Route:</strong> {booking.from} → {booking.to}
        </p>
        <p>
          <strong>Quantity:</strong> {booking.quantity}
        </p>
        <p>
          <strong>Total Price:</strong> ৳{booking.totalPrice}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="capitalize">{booking.status}</span>
        </p>
      </div>

      <button
        onClick={handlePayment}
        disabled={booking.status !== "accepted"}
        className={`w-full mt-6 py-2 rounded text-white transition ${
          booking.status === "accepted"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Pay Now
      </button>

      <button
        onClick={() => navigate(-1)}
        className="w-full mt-3 py-2 rounded border cursor-pointer"
      >
        Go Back
      </button>
    </div>
  );
};

export default Payment;
