import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { imageUpload } from "../../../utils/Index";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import useProfile from "../../../hooks/useProfile";
import { 
  Ticket, 
  MapPin, 
  Bus, 
  DollarSign, 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  CheckSquare, 
  Mail, 
  User, 
  AlertCircle,
  Loader2,
  Save,
  ArrowLeft,
  X
} from "lucide-react";

const UpdateTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading } = useContext(AuthContext);
  const [profile, isProfileLoading] = useProfile();

  const isFraud = useMemo(() => {
    if (isProfileLoading) return false;
    return profile?.isFraud || false;
  }, [profile?.isFraud, isProfileLoading]);
  
  const axiosSecure = useAxiosSecure();

  const [ticket, setTicket] = useState(null);
 

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const transportTypes = ["Bus", "Train", "Plane", "Launch"];
  const perksOptions = ["AC", "Breakfast", "WiFi", "Meal"];
  const locations = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Mymensingh", "Rangpur", "Kolkata", "Delhi", "Singapore", "Dubai"];

  // Watch image input for preview
  const imageFile = watch("image");

  // Handle image preview
  useEffect(() => {
    if (imageFile && imageFile[0] && imageFile[0] instanceof File) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        // Keep existing preview if there's an error
        if (ticket?.image) {
          setImagePreview(ticket.image);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [imageFile, ticket?.image]);

  //  FETCH TICKET ----------
  useEffect(() => {
    if (isProfileLoading) return;
    if(profile?.isFraud) return;
    if(!profile?.email) return;

    const fetchTicket = async () => {
      try {
        const res = await axiosSecure.get(`/tickets/${id}`);
        setTicket(res.data?.data);

        // Pre-fill form safely
        reset({
          ...res.data?.data,
          quantity: res.data?.data?.totalQuantity,
          departureTime: new Date(res.data?.data?.departureTime)
            .toISOString()
            .slice(0, 16),
        });
        
        // Set initial image preview to existing ticket image
        if (res.data?.data?.image) {
          setImagePreview(res.data.data.image);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load ticket data");
      }
    };

    fetchTicket();
  }, [axiosSecure, id, reset, profile, isProfileLoading]);

  // --------FETCH VENDOR FRAUD STATUS ----------
 


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
      if (data.image && data.image[0] && data.image[0] instanceof File) {
        imageUrl = await imageUpload(data.image[0]);
      }
      const {_id, ...rest} = data;
      const updatedTicket = {
        ...rest,
        image: imageUrl,
      };
      console.log(updatedTicket);
      
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 mb-4 transition"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Ticket className="text-teal-600" size={32} />
            Update Ticket
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Update ticket information and details
          </p>
        </div>

        {/* Warnings */}
        {isFraud && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
            <p className="text-red-700 dark:text-red-300 font-semibold">
              You are marked as Fraud Vendor. You cannot update tickets.
            </p>
          </div>
        )}

        {ticket?.verificationStatus === "approved" && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
            <AlertCircle className="text-amber-600 dark:text-amber-400" size={24} />
            <p className="text-amber-700 dark:text-amber-300 font-semibold">
              This ticket is approved and cannot be updated.
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Ticket size={18} />
                Ticket Title
              </label>
              <input
                {...register("title", { required: "Ticket title is required" })}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed ${
                  errors.title ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"
                }`}
                disabled={isDisabled}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* From & To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <MapPin size={18} />
                  From
                </label>
                <select
                  {...register("from", { required: "From location is required" })}
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed ${
                    errors.from ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"
                  }`}
                  disabled={isDisabled}
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                {errors.from && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.from.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <MapPin size={18} />
                  To
                </label>
                <select
                  {...register("to", { required: "To location is required" })}
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed ${
                    errors.to ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"
                  }`}
                  disabled={isDisabled}
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                {errors.to && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.to.message}
                  </p>
                )}
              </div>
            </div>

            {/* Transport */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Bus size={18} />
                Transport Type
              </label>
              <select
                {...register("transportType", {
                  required: "Transport type is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed ${
                  errors.transportType ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"
                }`}
                disabled={isDisabled}
              >
                <option value={ticket.transportType}>{ticket.transportType}</option>
                {transportTypes.filter((type) => type !== ticket.transportType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.transportType && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.transportType.message}
                </p>
              )}
            </div>

            {/* Price & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <DollarSign size={18} />
                  Price
                </label>
                <input
                  type="number"
                  {...register("price", { required: "Price is required", min: { value: 1, message: "Price must be at least 1" } })}
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed ${
                    errors.price ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"
                  }`}
                  disabled={isDisabled}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <Users size={18} />
                  Quantity
                </label>
                <input
                  type="number"
                  {...register("quantity", { required: "Quantity is required", min: { value: 1, message: "Quantity must be at least 1" } })}
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed ${
                    errors.quantity ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"
                  }`}
                  disabled={isDisabled}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.quantity.message}
                  </p>
                )}
              </div>
            </div>

            {/* Departure */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Calendar size={18} />
                Departure Date & Time
              </label>
              <input
                type="datetime-local"
                {...register("departureTime", { required: "Departure time is required" })}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed ${
                  errors.departureTime ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"
                }`}
                disabled={isDisabled}
              />
              {errors.departureTime && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.departureTime.message}
                </p>
              )}
            </div>

            {/* Perks */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <CheckSquare size={18} />
                Perks & Amenities
              </label>
              <div className="flex gap-4 flex-wrap p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                {perksOptions.map((perk) => (
                  <label key={perk} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer'
                  }`}>
                    <input
                      type="checkbox"
                      value={perk}
                      {...register("perks")}
                      disabled={isDisabled}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{perk}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <ImageIcon size={18} />
                Ticket Image
              </label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-md h-64 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                    {/* Only show X button when a new file is selected */}
                    {imageFile && imageFile[0] && imageFile[0] instanceof File && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(ticket?.image || null);
                          setValue("image", null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        disabled={isDisabled}
                      >
                        <X size={16} />
                      </button>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      {imageFile && imageFile[0] && imageFile[0] instanceof File ? "New image preview" : "Current image"}
                    </p>
                  </div>
                )}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 bg-slate-50 dark:bg-slate-800">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image", {
                      onChange: (e) => {
                        fileInputRef.current = e.target;
                      }
                    })}
                    disabled={isDisabled}
                    className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 dark:file:bg-teal-900/30 file:text-teal-700 dark:file:text-teal-300 hover:file:bg-teal-100 dark:hover:file:bg-teal-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Vendor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <User size={18} />
                  Vendor Name
                </label>
                <input
                  value={ticket.vendorName}
                  readOnly
                  className="w-full px-4 py-3 border rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <Mail size={18} />
                  Vendor Email
                </label>
                <input
                  value={ticket.vendorEmail}
                  readOnly
                  className="w-full px-4 py-3 border rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                isDisabled
                  ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  : "bg-linear-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              <Save size={20} />
              Update Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateTicket;
