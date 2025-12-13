import { Link } from "react-router";

const PaymentCancelled = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-red-600 mb-3">
        Payment Cancelled
      </h2>

      <p className="text-gray-600 mb-6">
        Your payment was not completed. You can try again before the
        departure time.
      </p>

      <Link to="/dashboard/my-booked-tickets"
        className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
      >
        
          Back to My Booked Tickets
        
      </Link>
    </div>
  );
};

export default PaymentCancelled;
