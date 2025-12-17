import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import banner from "../../assets/Register.jpg"; 
import { AuthContext } from "../../Provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Register = () => {
  const { createUser, updateUser, googleLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const axiosSecure = useAxiosSecure();

  const onSubmit = (data) => {
    setLoading(true);

    createUser(data.email, data.password)
      .then((result) => {
        console.log(result)
        updateUser({
          displayName: data.name,
          photoURL: data.photo
        })
        .then(() => {

          // now send to database
          const userInfo = {
            email: data.email,
            displayName: data.name,
            photoURL: data.photo,
            role: "user"
          };

          axiosSecure.post('/users', userInfo)
            .then(res => {
              if (res.data.insertedId) {
                toast.success('User created in DB!');
              }
            })

          toast.success("Registration Successful!");
          navigate("/");
        })
        .catch(() => toast.error("Failed to update user"));
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleLogin();
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

   


  // monngodb

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-xl dark:shadow-slate-800/50 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
        {/* Left Side Banner */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={banner}
            alt="ticket booking"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
          <h2 className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-4 text-center">
            Create Your Account
          </h2>
          <p className="text-gray-600 dark:text-slate-400 text-center mb-6">
            Join now and start booking your tickets in seconds!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register("name", { required: true, minLength: 5 })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {errors.name?.type === "required" && (
                <p className="text-red-500 text-xs mt-1">Name is required.</p>
              )}
              {errors.name?.type === "minLength" && (
                <p className="text-red-500 text-xs mt-1">
                  Name must be at least 5 characters.
                </p>
              )}
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Photo URL
              </label>
              <input
                type="text"
                placeholder="Enter your photo URL"
                {...register("photo", { required: true })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {errors.photo && (
                <p className="text-red-500 text-xs mt-1">Photo URL is required.</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500 text-xs mt-1">Email is required.</p>
              )}
              {errors.email?.type === "pattern" && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  {...register("password", {
                    required: true,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                  })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password?.type === "required" && (
                <p className="text-red-500 text-xs mt-1">Password is required.</p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-500 text-xs mt-1">
                  Password must contain at least one uppercase, one lowercase, and be
                  at least 6 characters.
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 cursor-pointer text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700"></div>
            <span className="text-sm text-gray-500 dark:text-slate-400">or</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 cursor-pointer py-3 rounded-lg bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Login Redirect */}
          <p className="text-center text-gray-600 dark:text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
