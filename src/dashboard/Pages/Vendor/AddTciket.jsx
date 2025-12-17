import React, { use, useMemo, useState, useRef } from "react";
import { useForm } from "react-hook-form";
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
  Plus,
  X
} from "lucide-react";

const AddTicket = () => {
  const { user } = use(AuthContext);
  const [profile, isProfileLoading] = useProfile();
  const axiosSecure = useAxiosSecure();
  const [isAdding, setIsAdding] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  // Watch image input for preview
  const imageFile = watch("image");

  const locations = ["Dhaka","Chattogram","Sylhet","Rajshahi","Khulna","Barishal","Mymensingh","Rangpur","Kolkata","Delhi","Singapore","Dubai"];
  const transportTypes = ["Bus", "Train", "Plane", "Launch"];

  // Derive isFraud directly from profile instead of using state
  const isFraud = useMemo(() => {
    if (isProfileLoading) return false;
    return profile?.isFraud || false;
  }, [profile?.isFraud, isProfileLoading]);

  // Handle image preview
  React.useEffect(() => {
    if (imageFile && imageFile[0] && imageFile[0] instanceof File) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setImagePreview(null);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);


  const onSubmit = async (data) => {
    if (isFraud) {
      return toast.error("You are marked as fraud! Cannot add tickets.");
    }
    try {
      setIsAdding(true);
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
        totalQuantity: Number(data.quantity),
        departureTime: data.departureTime,
        perks: data.perks || [],
        image: imageUrl,
      };
      // Save to database using secure axios
      await axiosSecure.post("/tickets", ticketData);

      toast.success("Ticket added successfully! Pending approval.");
      reset();
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add ticket");
    } finally {
       setIsAdding(false);
    }
  };

  if (isProfileLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Ticket className="text-teal-600" size={32} />
            Add New Ticket
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Fill in the details to create a new ticket listing
          </p>
        </div>

        {/* Fraud Warning */}
        {isFraud && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
            <p className="text-red-700 dark:text-red-300 font-semibold">
              You are marked as fraud! You cannot add tickets.
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 relative">
          {/* Loading Overlay */}
          {isAdding && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-teal-600" size={32} />
                <p className="text-slate-700 dark:text-slate-300 font-medium">Adding ticket...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Ticket Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Ticket size={18} />
                Ticket Title
              </label>
              <input
                type="text"
                placeholder="Enter ticket title"
                {...register("title", { required: "Ticket title is required" })}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                  ${errors.title ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"}`}
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
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                    ${errors.from ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"}`}
                >
                  <option value="">Select location</option>
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
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                    ${errors.to ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"}`}
                >
                  <option value="">Select location</option>
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

            {/* Transport Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Bus size={18} />
                Transport Type
              </label>
              <select
                {...register("transportType", {
                  required: "Transport type is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                  ${errors.transportType ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"}`}
              >
                <option value="">Select transport</option>
                {transportTypes.map((type) => (
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
                  Price (per unit)
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  {...register("price", { required: "Price is required", min: 1 })}
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                    ${errors.price ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"}`}
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
                  Ticket Quantity
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  {...register("quantity", { required: "Quantity is required", min: 1 })}
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                    ${errors.quantity ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"}`}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.quantity.message}
                  </p>
                )}
              </div>
            </div>

            {/* Departure Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Calendar size={18} />
                Departure Date & Time
              </label>
              <input
                type="datetime-local"
                {...register("departureTime", {
                  required: "Departure time is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                  ${errors.departureTime ? "border-red-500 focus:ring-red-400" : "border-slate-300 dark:border-slate-600 focus:ring-teal-600"}`}
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
                {["AC", "Breakfast", "WiFi", "Recliner Seat"].map((perk) => (
                  <label key={perk} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition">
                    <input 
                      type="checkbox" 
                      value={perk} 
                      {...register("perks")}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{perk}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image Upload */}
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
                          setImagePreview(null);
                          setValue("image", null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                )}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 bg-slate-50 dark:bg-slate-800">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image", { 
                      required: "Image is required",
                      onChange: (e) => {
                        fileInputRef.current = e.target;
                      }
                    })}
                    className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 dark:file:bg-teal-900/30 file:text-teal-700 dark:file:text-teal-300 hover:file:bg-teal-100 dark:hover:file:bg-teal-900/50"
                  />
                </div>
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Vendor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <User size={18} />
                  Vendor Name
                </label>
                <input
                  value={user?.displayName || ""}
                  readOnly
                  disabled
                  className="w-full px-4 py-3 border rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <Mail size={18} />
                  Vendor Email
                </label>
                <input
                  value={user?.email || ""}
                  readOnly
                  disabled
                  className="w-full px-4 py-3 border rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isFraud || isAdding}
              className={`w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                isFraud || isAdding
                  ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  : "bg-linear-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              {isAdding ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Adding Ticket...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add Ticket
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTicket;
