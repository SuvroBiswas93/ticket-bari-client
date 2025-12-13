import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useParams, Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { imageUpload } from "../../../utils/Index";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";

const UpdateTicket = () => {
  const { id } = useParams();
  const { user, loading } = useContext(AuthContext); // use loading from AuthContext
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const perksOptions = ["AC", "Breakfast", "WiFi", "Meal"];
  const locations = ["Dhaka","Chattogram","Sylhet","Rajshahi","Khulna","Barishal","Mymensingh","Rangpur","Kolkata","Delhi","Singapore","Dubai"];

  // Fetch ticket data
 useEffect(() => {
  if (!user?.email) return;

  const fetchData = async () => {
    try {
      const res = await axiosSecure.get(`/tickets/${id}`);
      setTicket(res.data);       
      reset(res.data);           
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ticket data");
    }
  };

  fetchData();
}, [user?.email, axiosSecure, id, reset]);

  const onSubmit = async (data) => {
    try {
      // Handle image upload if new file selected
      let imageUrl = ticket.image;
      if (data.image && data.image[0]) {
        imageUrl = await imageUpload(data.image[0]);
      }

      const updatedTicket = {
        ...data,
        image: imageUrl,
        vendorName: ticket.vendorName,
        vendorEmail: ticket.vendorEmail,
        status: ticket.status, // keep status unchanged
      };

      await axiosSecure.put(`/tickets/${id}`, updatedTicket);
      toast.success("Ticket updated successfully");
      navigate("/dashboard/my-added-tickets");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ticket");
    }
  };

  if (loading || !ticket) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-700">Update Ticket</h2>
        <Link
          to="/dashboard/my-added-tickets"
          className="py-2 px-4 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
        {/* Ticket Title */}
        <div>
          <label className="block font-medium">Ticket Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full px-3 py-2 border rounded"
            disabled={ticket.status === "rejected"}
          />
        </div>

        {/* From & To */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium">From</label>
            <select
              {...register("from", { required: true })}
              className="w-full px-3 py-2 border rounded"
              disabled={ticket.status === "rejected"}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-medium">To</label>
            <select
              {...register("to", { required: true })}
              className="w-full px-3 py-2 border rounded"
              disabled={ticket.status === "rejected"}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transport Type */}
        <div>
          <label className="block font-medium">Transport Type</label>
          <input
            type="text"
            {...register("transportType", { required: true })}
            className="w-full px-3 py-2 border rounded"
            disabled={ticket.status === "rejected"}
          />
        </div>

        {/* Price & Quantity */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium">Price (per unit)</label>
            <input
              type="number"
              {...register("price", { required: true })}
              className="w-full px-3 py-2 border rounded"
              disabled={ticket.status === "rejected"}
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Ticket Quantity</label>
            <input
              type="number"
              {...register("quantity", { required: true })}
              className="w-full px-3 py-2 border rounded"
              disabled={ticket.status === "rejected"}
            />
          </div>
        </div>

        {/* Departure Date & Time */}
        <div>
          <label className="block font-medium">Departure Date & Time</label>
          <input
            type="datetime-local"
            {...register("departureTime", { required: true })}
            className="w-full px-3 py-2 border rounded"
            disabled={ticket.status === "rejected"}
            defaultValue={new Date(ticket.departureTime).toISOString().slice(0, 16)}
          />
        </div>

        {/* Perks */}
        <div>
          <label className="block font-medium mb-2">Perks</label>
          <div className="flex gap-3 flex-wrap">
            {perksOptions.map((perk) => (
              <label key={perk} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={perk}
                  {...register("perks")}
                  defaultChecked={ticket.perks?.includes(perk)}
                  disabled={ticket.status === "rejected"}
                />
                {perk}
              </label>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium">Image</label>
          <input
            type="file"
            {...register("image")}
            className="w-full"
            disabled={ticket.status === "rejected"}
          />
          <img
            src={ticket.image}
            alt={ticket.title}
            className="w-40 h-28 mt-2 object-cover rounded"
          />
        </div>

        {/* Vendor Info */}
        <div className="flex gap-4">
          <input
            type="text"
            value={ticket.vendorName}
            readOnly
            className="flex-1 px-3 py-2 border rounded bg-gray-100"
          />
          <input
            type="text"
            value={ticket.vendorEmail}
            readOnly
            className="flex-1 px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 cursor-pointer rounded bg-teal-600 text-white hover:bg-teal-700 transition ${
            ticket.status === "rejected" ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={ticket.status === "rejected"}
        >
          Update Ticket
        </button>
      </form>
    </div>
  );
};

export default UpdateTicket;
