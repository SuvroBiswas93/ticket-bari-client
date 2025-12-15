import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { imageUpload } from "../../../utils/Index";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";

const AddTicket = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
   const [isFraud, setIsFraud] = useState(false);
   const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const locations = ["Dhaka","Chattogram","Sylhet","Rajshahi","Khulna","Barishal","Mymensingh","Rangpur","Kolkata","Delhi","Singapore","Dubai"];
  const transportTypes = ["Bus", "Train", "Plane", "Launch"];

   // Check if vendor is fraud
  useEffect(() => {
    const checkFraudStatus = async () => {
      try {
        const res = await axiosSecure.get(`/users/${user?.email}`);
        setIsFraud(res.data.isFraud || false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch vendor info");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) checkFraudStatus();
  }, [user?.email, axiosSecure]);


  const onSubmit = async (data) => {
     if (isFraud) {
      return toast.error("You are marked as fraud! Cannot add tickets.");
    }
    try {
      // Upload image
      const imageFile = data.image[0];
      const imageUrl = await imageUpload(imageFile);
     

      // Prepare ticket payload
     const ticketData = {
        title: data.title,
        from: data.from,
        to: data.to,
        transportType: data.transportType,
        price: Number(data.price),
        quantity: Number(data.quantity),
        departureTime: data.departureTime,
        perks: data.perks || [],
        image: imageUrl,
        vendorName: user?.displayName,
        vendorEmail: user?.email,
        status: "pending",
        createdAt: new Date(),
      };
      // Save to database using secure axios
      await axiosSecure.post("/tickets", ticketData);

      toast.success("Ticket added successfully! Pending approval.");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add ticket");
    }
  };
if (loading) return <LoadingSpinner></LoadingSpinner>;
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Add Ticket
        </h2>

        {isFraud && (
          <p className="text-red-600 text-center mb-4 font-semibold">
            You are marked as fraud! You cannot add tickets.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Ticket Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Title
            </label>
            <input
              type="text"
              placeholder="Enter ticket title"
              {...register("title", { required: "Ticket title is required" })}
              className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 text-black
                ${errors.title ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* From & To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <select
                {...register("from", { required: "From location is required" })}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2
                  ${errors.from ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"}`}
              >
                <option value="">Select location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.from && (
                <p className="text-red-500 text-sm mt-1">{errors.from.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <select
                {...register("to", { required: "To location is required" })}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2
                  ${errors.to ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"}`}
              >
                <option value="">Select location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.to && (
                <p className="text-red-500 text-sm mt-1">{errors.to.message}</p>
              )}
            </div>
          </div>

          {/* Transport Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transport Type
            </label>
            <select
              {...register("transportType", {
                required: "Transport type is required",
              })}
              className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2
                ${errors.transportType ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"}`}
            >
              <option value="">Select transport</option>
              {transportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.transportType && (
              <p className="text-red-500 text-sm mt-1">{errors.transportType.message}</p>
            )}
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (per unit)
              </label>
              <input
                type="number"
                {...register("price", { required: "Price is required", min: 1 })}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2
                  ${errors.price ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"}`}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Quantity
              </label>
              <input
                type="number"
                {...register("quantity", { required: "Quantity is required", min: 1 })}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2
                  ${errors.quantity ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"}`}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date & Time
            </label>
            <input
              type="datetime-local"
              {...register("departureTime", {
                required: "Departure time is required",
              })}
              className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2
                ${errors.departureTime ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"}`}
            />
            {errors.departureTime && (
              <p className="text-red-500 text-sm mt-1">{errors.departureTime.message}</p>
            )}
          </div>

          {/* Perks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Perks
            </label>
            <div className="flex gap-4 flex-wrap">
              {["AC", "Breakfast", "WiFi", "Recliner Seat"].map((perk) => (
                <label key={perk} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={perk} {...register("perks")} />
                  {perk}
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Image
            </label>
            <input
              type="file"
              {...register("image", { required: "Image is required" })}
              className="w-full"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          {/* Vendor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Name
              </label>
              <input
                value={user?.displayName || ""}
                readOnly
                className="w-full px-4 py-3 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Email
              </label>
              <input
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-3 border rounded-lg bg-gray-100"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isFraud}
            className={`w-full cursor-pointer py-3 rounded-lg font-semibold transition
              ${isFraud ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 text-white hover:bg-teal-700"}`}
          >
            Add Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;
