import { useCallback, useEffect, useState, useMemo } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { toast } from 'react-toastify';
import useProfile from '../../../hooks/useProfile';
import { CheckCircle2, XCircle, AlertCircle, Mail, User } from 'lucide-react';

const RequestedBookings = () => {
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
const [profile, isProfileLoading  ] = useProfile();
const isFraud = useMemo(() => {
  if (isProfileLoading) return false;
  return profile?.isFraud || false;
}, [profile?.isFraud, isProfileLoading]);   
  // Fetch vendor booking requests
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get('/bookings/vendor/my-bookings');
      setBookings(res.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    if (isProfileLoading) return;
    
    // If fraud or no email, stop loading but don't fetch
    if (profile?.isFraud || !profile?.email) {
      setLoading(false);
      return;
    }
    
    fetchBookings();
  }, [isProfileLoading, profile?.isFraud, profile?.email, fetchBookings]);

  const handleAction = async (id, status) => {
    if (isFraud) return toast.error('You are marked as Fraud Vendor. Cannot accept/reject bookings.');

    try {
      await axiosSecure.put(`/bookings/${id}/status`, { status });
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
                You are marked as a Fraud Vendor. You cannot accept or reject booking requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Requested Bookings
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Review and manage booking requests for your tickets
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="mx-auto text-slate-400 mb-4" size={64} />
            <p className="text-xl text-slate-600 dark:text-slate-400 font-semibold">
              No booking requests found
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Booking requests will appear here when users book your tickets
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {bookings.map((booking) => (
                    <tr 
                      key={booking._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="text-slate-500" size={16} />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {booking.userName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="text-slate-500" size={16} />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {booking.userEmail}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-900 dark:text-white font-medium">
                          {booking.ticketTitle}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {booking.bookingQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                          ৳ {booking.totalPrice?.toLocaleString() || booking.totalPrice}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'pending'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                              : booking.status === 'accepted'
                              ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}
                        >
                          {booking.status === 'accepted' && <CheckCircle2 size={12} />}
                          {booking.status === 'rejected' && <XCircle size={12} />}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            disabled={booking.status !== 'pending' || isFraud}
                            onClick={() => handleAction(booking._id, 'accepted')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                              booking.status !== 'pending' || isFraud
                                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                                : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-md'
                            }`}
                          >
                            <CheckCircle2 size={16} />
                            Accept
                          </button>

                          <button
                            disabled={booking.status !== 'pending' || isFraud}
                            onClick={() => handleAction(booking._id, 'rejected')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                              booking.status !== 'pending' || isFraud
                                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-md'
                            }`}
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestedBookings;
