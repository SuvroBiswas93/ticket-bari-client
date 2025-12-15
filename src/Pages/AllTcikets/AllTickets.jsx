import { useState, useEffect, useMemo } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import TicketCard from "../../Components/ticketCard/TicketCard";

export default function AllTickets() {
  const axiosSecure = useAxiosSecure();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchRoute, setSearchRoute] = useState("");
  const [transportType, setTransportType] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Admin Approved Tickets

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axiosSecure.get("/tickets?status=approved");
        setTickets(res.data);
      } catch (err) {
        console.error("Error fetching approved tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [axiosSecure]);

 
  // Filter + Search + Sorting
 
  const filtered = useMemo(() => {
    const result = tickets.filter((ticket) => {
      const matchRoute =
        `${ticket.from} ${ticket.to}`.toLowerCase().includes(searchRoute.toLowerCase());

      const matchType = transportType ? ticket.transportType === transportType : true;

      return matchRoute && matchType;
    });

    if (sortBy === "price") result.sort((a, b) => a.price - b.price);
    if (sortBy === "departure") result.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));

    return result;
  }, [tickets, searchRoute, transportType, sortBy]);

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedTickets = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <LoadingSpinner/>

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          All Tickets
        </h1>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Search Route
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  value={searchRoute}
                  onChange={(e) => {
                    setSearchRoute(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by route..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Transport Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Transport Type
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-3 text-slate-400" size={20} />
                <select
                  value={transportType}
                  onChange={(e) => {
                    setTransportType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none"
                >
                  <option value="">All Types</option>
                  <option value="Bus">Bus</option>
                  <option value="Train">Train</option>
                  <option value="Plane">Plane</option>
                  <option value="Ship">Ship</option>
                </select>
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Sort By
              </label>
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-3 text-slate-400" size={20} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none"
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="departure">Departure Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        {paginatedTickets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedTickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition ${
                    currentPage === page
                      ? "bg-teal-600 text-white"
                      : "border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600 dark:text-slate-400">No tickets found</p>
          </div>
        )}
      </div>
    </div>
  );
}
