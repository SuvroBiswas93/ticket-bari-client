// AdvertisementSection.jsx
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import TicketCard from "../../../Components/ticketCard/TicketCard";


const AdvertisementSection = () => {
  const axiosSecure = useAxiosSecure();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisedTickets = async () => {
      try {
        const res = await axiosSecure.get("/tickets/advertised");
        // Assuming backend returns exactly 6 tickets max
        setTickets(res.data);
      } catch (error) {
        console.error("Failed to fetch advertised tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisedTickets();
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner/>;

  if (tickets.length === 0)
    return (
      <div className="text-center py-10 text-gray-500">
        No advertised tickets available
      </div>
    );

  return (
    <section className="my-12 container mx-auto px-4 lg:px-8">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Featured Tickets
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id || ticket._id} ticket={ticket}/>
        ))}
      </div>
    </section>
  );
};

export default AdvertisementSection;
