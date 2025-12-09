import React, { use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { AuthContext } from "../../Provider/AuthProvider";

const ForgotPassword = () => {
 const {resetPassword} = use(AuthContext)

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const email = data.email;

    resetPassword(email)
      .then(() => {
        toast.success("Password reset link sent! Check your Gmail inbox.");
        reset();
        window.open("https://mail.google.com/", "_blank");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 to-emerald-50 px-4 ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Forgot Password?
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your email
            </label>

            <input
              type="email"
              placeholder="Write your email"
              {...register("email", {
                required: "Email is required!",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address!",
                },
              })}
              className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 text-black
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-green-500"
                }`}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition "
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-gray-600 mt-6">
          Remember your password?{" "}
          <Link to="/auth/login" className="text-teal-600 font-semibold">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
