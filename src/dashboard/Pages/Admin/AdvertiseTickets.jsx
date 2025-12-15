import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";



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
          "/tickets?status=approved"
        );
        setTickets(res.data);
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
      await axiosSecure.patch(
        `/tickets/advertise/${ticket._id}`,
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


  if (loading) return <LoadingSpinner/>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-teal-600">
        Advertise Tickets
      </h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg border border-teal-500">
        <table className="table w-full">
          <thead className="bg-teal-500 text-black ">
            <tr>
              <th>#</th>
              <th>Ticket</th>
              <th>Route</th>
              <th>Transport</th>
              <th>Price</th>
              <th>Departure</th>
              <th className="text-center">Advertise</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id}>
                <td>{index + 1}</td>

                <td className="flex items-center gap-3">
                  <img
                    src={ticket.image}
                    alt={ticket.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <span>{ticket.title}</span>
                </td>

                <td>
                  {ticket.from} → {ticket.to}
                </td>

                <td>{ticket.transportType}</td>

                <td>৳ {ticket.price}</td>

                <td>
                  {new Date(
                    ticket.departureDate
                  ).toLocaleString()}
                </td>

                <td className="text-center">
                  <button
                    onClick={() =>
                      handleAdvertiseToggle(ticket)
                    }
                    className={`btn btn-sm ${
                      ticket.isAdvertised
                        ? "btn-error"
                        : "btn-success"
                    }`}
                  >
                    {ticket.isAdvertised
                      ? "Unadvertise"
                      : "Advertise"}
                  </button>
                </td>
              </tr>
            ))}

            {tickets.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-black">
                  No approved tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvertiseTickets;
