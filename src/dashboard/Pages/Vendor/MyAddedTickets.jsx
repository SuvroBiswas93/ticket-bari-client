import React, { use, useCallback, useEffect, useState, } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";

const MyAddedTickets = () => {
    const { user, loading } = use(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [tickets, setTickets] = useState([]);
    const [ticketsLoading, setTicketsLoading] = useState(true);


    // Fetch tickets added by this vendor
    const fetchTickets = useCallback(async () => {
        try {
            setTicketsLoading(true);
            const res = await axiosSecure.get(`/tickets?vendorEmail=${user?.email}`);
            setTickets(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load tickets");
        } finally {
            setTicketsLoading(false);
        }
    }, [axiosSecure, user?.email]);

    useEffect(() => {
        if (user?.email) {
            fetchTickets();
        }
    }, [user?.email, fetchTickets]);

    // Delete ticket

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/tickets/${id}`);
                setTickets(tickets.filter((ticket) => ticket._id !== id));
                Swal.fire("Deleted!", "Your ticket has been deleted.", "success");
            } catch (error) {
                console.error(error);
                Swal.fire("Error!", "Failed to delete ticket.", "error");
            }
        }
    };


    if (loading || ticketsLoading) return <LoadingSpinner></LoadingSpinner>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-teal-700 mb-6">My Added Tickets</h2>
            {tickets.length === 0 ? (
                <p>No tickets added yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            className="border rounded-lg shadow p-4 flex flex-col justify-between"
                        >
                            <img
                                src={ticket.image}
                                alt={ticket.title}
                                className="w-full h-40 object-cover rounded mb-3"
                            />
                            <h3 className="text-lg font-semibold">{ticket.title}</h3>
                            <p>
                                <strong>From:</strong> {ticket.from} <br />
                                <strong>To:</strong> {ticket.to} <br />
                                <strong>Transport:</strong> {ticket.transportType} <br />
                                <strong>Price:</strong> ${ticket.price} <br />
                                <strong>Quantity:</strong> {ticket.quantity} <br />
                                <strong>Departure:</strong>{" "}
                                {new Date(ticket.departureTime).toLocaleString()} <br />
                                <strong>Perks:</strong>{" "}
                                {ticket.perks?.length > 0 ? ticket.perks.join(", ") : "None"} <br />
                            </p>
                            <p className="mt-2">
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`${ticket.status === "pending"
                                        ? "text-yellow-600"
                                        : ticket.status === "approved"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        } font-semibold`}
                                >
                                    {ticket.status.toUpperCase()}
                                </span>
                            </p>
                            <div className="mt-4 flex gap-2">
                                <Link
                                    to={`/update-ticket/${ticket._id}`}
                                    className={`flex-1 text-center py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${ticket.status === "rejected" ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    onClick={(e) => {
                                        if (ticket.status === "rejected") e.preventDefault();
                                    }}
                                >
                                    Update
                                </Link>
                                <button
                                    onClick={() => handleDelete(ticket._id)}
                                    className={`flex-1 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition ${ticket.status === "rejected" ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    disabled={ticket.status === "rejected"}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAddedTickets;
