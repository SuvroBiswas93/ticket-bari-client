import { useCallback, useEffect, useState, useContext } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../Provider/AuthProvider';

const RequestedBookings = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFraud, setIsFraud] = useState(false);

  // FETCH vendor status
  const fetchUserStatus = useCallback(async () => {
    try {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      setIsFraud(res.data?.isFraud || false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to get vendor status');
    }
  }, [axiosSecure, user?.email]);

  // Fetch vendor booking requests
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get('/vendor/bookings');
      setBookings(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    if (user?.email) {
      fetchUserStatus();
      fetchBookings();
    }
  }, [user?.email, fetchBookings, fetchUserStatus]);

  const handleAction = async (id, status) => {
    if (isFraud) return toast.error('You are marked as Fraud Vendor. Cannot accept/reject bookings.');

    try {
      await axiosSecure.patch(`/vendor/bookings/${id}`, { status });
      toast.success(`Booking ${status} successfully`);
      fetchBookings();
    } catch (error) {
      console.error(error);
      toast.error('Action failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (isFraud) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-6">
          You are marked as Fraud Vendor
        </h2>
        <p className="text-gray-500">You cannot accept or reject bookings.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Requested Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No booking requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Ticket</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.userName}</td>
                  <td>{booking.userEmail}</td>
                  <td>{booking.ticketTitle}</td>
                  <td>{booking.quantity}</td>
                  <td>${booking.totalPrice}</td>
                  <td className="space-x-2">
                    <button
                      disabled={booking.status !== 'pending' || isFraud}
                      onClick={() => handleAction(booking._id, 'accepted')}
                      className={`px-3 py-1 rounded text-white ${
                        booking.status !== 'pending' || isFraud
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      Accept
                    </button>

                    <button
                      disabled={booking.status !== 'pending' || isFraud}
                      onClick={() => handleAction(booking._id, 'rejected')}
                      className={`px-3 py-1 rounded text-white ${
                        booking.status !== 'pending' || isFraud
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestedBookings;
