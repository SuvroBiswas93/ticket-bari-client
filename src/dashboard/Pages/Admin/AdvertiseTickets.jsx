import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { MapPin, Bus, Calendar, AlertCircle, TrendingUp, TrendingDown, Ticket } from "lucide-react";



const AdvertiseTickets = () => {
  const axiosSecure = useAxiosSecure();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH APPROVED TICKETS =================
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(
          "/admins/tickets/all"
        );
        setTickets(res.data?.data || []);
      } catch  {
        Swal.fire("Error", "Failed to load tickets", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [axiosSecure]);

  // ================= TOGGLE ADVERTISEMENT =================
  const handleAdvertiseToggle = async (ticket) => {
    const advertisedCount = tickets.filter(
      (t) => t.isAdvertised
    ).length;

    if (!ticket.isAdvertised && advertisedCount >= 6) {
      return Swal.fire(
        "Limit Exceeded",
        "You can advertise maximum 6 tickets only",
        "warning"
      );
    }

    try {
      await axiosSecure.put(
        `/admins/tickets/${ticket._id}/advertise`,
        { isAdvertised: !ticket.isAdvertised }
      );

      setTickets((prev) =>
        prev.map((t) =>
          t._id === ticket._id
            ? { ...t, isAdvertised: !t.isAdvertised }
            : t
        )
      );

      Swal.fire(
        "Success",
        ticket.isAdvertised
          ? "Ticket removed from advertisement"
          : "Ticket added to advertisement",
        "success"
      );
    } catch {
      Swal.fire("Error", "Action failed", "error");
    }
  };


  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <LoadingSpinner/>;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Advertise Tickets
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage featured tickets for homepage advertisement (Max 6 tickets)
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="mx-auto text-slate-400 mb-4" size={64} />
            <p className="text-xl text-slate-600 dark:text-slate-400 font-semibold">
              No approved tickets found
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Only approved tickets can be advertised
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Transport
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Departure Time
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
                  {tickets.map((ticket, index) => (
                    <tr 
                      key={ticket._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ticket.image}
                            alt={ticket.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <Ticket className="text-slate-500" size={14} />
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {ticket.title}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MapPin className="text-slate-500" size={14} />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {ticket.from} → {ticket.to}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Bus className="text-slate-500" size={14} />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {ticket.transportType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                          ৳ {ticket.price?.toLocaleString() || ticket.price}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-slate-500" size={14} />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(ticket.departureTime)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.isAdvertised && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                            <TrendingUp size={12} />
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleAdvertiseToggle(ticket)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                            ticket.isAdvertised
                              ? "bg-red-600 hover:bg-red-700 text-white hover:shadow-md"
                              : "bg-teal-600 hover:bg-teal-700 text-white hover:shadow-md"
                          }`}
                        >
                          {ticket.isAdvertised ? (
                            <>
                              <TrendingDown size={16} />
                              Unadvertise
                            </>
                          ) : (
                            <>
                              <TrendingUp size={16} />
                              Advertise
                            </>
                          )}
                        </button>
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

export default AdvertiseTickets;
