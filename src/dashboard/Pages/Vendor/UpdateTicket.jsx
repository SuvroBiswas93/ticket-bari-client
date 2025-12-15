import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { imageUpload } from "../../../utils/Index";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";

const UpdateTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [ticket, setTicket] = useState(null);
  const [isFraud, setIsFraud] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const perksOptions = ["AC", "Breakfast", "WiFi", "Meal"];
  const locations = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Mymensingh", "Rangpur", "Kolkata", "Delhi", "Singapore", "Dubai"];

  //  FETCH TICKET ----------
  useEffect(() => {
    if (!user?.email) return;

    const fetchTicket = async () => {
      try {
        const res = await axiosSecure.get(`/tickets/${id}`);
        setTicket(res.data);

        // Pre-fill form safely
        reset({
          ...res.data,
          departureTime: new Date(res.data.departureTime)
            .toISOString()
            .slice(0, 16),
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load ticket data");
      }
    };

    fetchTicket();
  }, [axiosSecure, id, reset, user?.email]);

  // --------FETCH VENDOR FRAUD STATUS ----------
  useEffect(() => {
    if (!user?.email) return;

    const fetchVendorStatus = async () => {
      try {
        const res = await axiosSecure.get(`/users/${user.email}`);
        setIsFraud(res.data?.isFraud || false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to get vendor status");
      }
    };

    fetchVendorStatus();
  }, [axiosSecure, user?.email]);


  // ----------SUBMIT ----------
  const onSubmit = async (data) => {
    if (ticket.status === "approved") {
      toast.error("Approved tickets cannot be updated");
      return;
    }

     if (isFraud) {
      toast.error("You are marked as Fraud Vendor. Cannot update tickets.");
      return;
    }
    try {
      let imageUrl = ticket.image;

      // Upload new image if selected
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

      //  Go back to previous page
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update ticket");
    }
  };

  //-------------------LOADING----------------
  if (loading || !ticket) {
    return <LoadingSpinner />;
  }

  const isDisabled = ticket.status === "approved" || ticket.status === "rejected" ||isFraud;

  // ------ UI -----------
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-teal-700 mb-6">
        Update Ticket
      </h2>
      {isFraud && (
        <p className="text-red-600 font-semibold mb-4">
          You are marked as Fraud Vendor. You cannot update tickets.
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        {/* Title */}
        <div>
          <label className="block font-medium">Ticket Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full px-3 py-2 border rounded"
            disabled={isDisabled}
          />
        </div>

        {/* From & To */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium">From</label>
            <select
              {...register("from", { required: true })}
              className="w-full px-3 py-2 border rounded"
              disabled={isDisabled}
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
              disabled={isDisabled}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transport */}
        <div>
          <label className="block font-medium">Transport Type</label>
          <input
            {...register("transportType", { required: true })}
            className="w-full px-3 py-2 border rounded"
            disabled={isDisabled}
          />
        </div>

        {/* Price & Quantity */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium">Price</label>
            <input
              type="number"
              {...register("price", { required: true })}
              className="w-full px-3 py-2 border rounded"
              disabled={isDisabled}
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium">Quantity</label>
            <input
              type="number"
              {...register("quantity", { required: true })}
              className="w-full px-3 py-2 border rounded"
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* Departure */}
        <div>
          <label className="block font-medium">Departure Date & Time</label>
          <input
            type="datetime-local"
            {...register("departureTime", { required: true })}
            className="w-full px-3 py-2 border rounded"
            disabled={isDisabled}
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
                  disabled={isDisabled}
                />
                {perk}
              </label>
            ))}
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block font-medium">Image</label>
          <input
            type="file"
            {...register("image")}
            disabled={isDisabled}
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
            value={ticket.vendorName}
            readOnly
            className="flex-1 px-3 py-2 border rounded bg-gray-100"
          />
          <input
            value={ticket.vendorEmail}
            readOnly
            className="flex-1 px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full py-2 rounded bg-teal-600 text-white transition ${
            isDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-teal-700"
          }`}
        >
          Update Ticket
        </button>
      </form>
    </div>
  );
};

export default UpdateTicket;
