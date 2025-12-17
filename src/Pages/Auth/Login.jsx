import React, { use } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import logo from "../../assets/ticket-bari.jpg";
import banner from "../../assets/Login.jpg";
import { AuthContext } from "../../Provider/AuthProvider";
import { useForm } from "react-hook-form";

const Login = () => {
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const { signIn, googleLogin } = use(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const shouldRedirectTo = (path) => {
        if (!path) return false;
        
        const protectedRoutes = ['/Dashboard', '/auth'];
        const isProtected = protectedRoutes.some(route => path.startsWith(route));
        
        return !isProtected;
    };

    const getRedirectPath = () => {
        const redirectPath = typeof location.state === 'string' 
            ? location.state 
            : location.state?.from || null;
        
        return shouldRedirectTo(redirectPath) ? redirectPath : "/";
    };

    const handleLogin = (data) => {
        const {email,password}= data
        signIn(email, password)
            .then((result) => {
                console.log(result)
                toast.success("Login Successful!");
                navigate(getRedirectPath());
            })
            .catch((error) => setError(error.code));
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await googleLogin();
            toast.success("Login successful!");
            navigate(getRedirectPath());
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  py-6 px-4 ">
            <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side Image */}
                <div className="md:w-1/2 hidden md:block">
                    <img
                        src={banner}
                        alt="ticket booking"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right Side Form */}
                <div className="md:w-1/2 w-full p-8 sm:p-12 flex flex-col justify-center">
                    <div className="flex flex-col items-center mb-6">
                        <img src={logo} className="w-12 h-12 rounded-lg mb-2" />
                        <h2 className="text-3xl font-bold text-teal-600">Welcome Back</h2>
                        <p className="text-gray-600 text-lg">
                            PLease Login to continue booking your tickets
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                {...register('email', { required: true,minLength:6, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-black"

                            />

                            {errors.email?.type === 'required' && <p className='text-red-500'>Email is required.</p>}
                            {errors.email?.type === 'minLength' && <p className='text-red-500'>Email Must be six characters or uppers.</p>}
                            {errors.email?.type === 'pattern' && (<p className='text-red-500'>Please enter a valid email address.</p>)}

                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register('password', { required: true,
                                     minLength: 6, 
                                     pattern: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/ })}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-black"

                                />
                                {
                                    errors.password?.type === 'required' && <p className='text-red-500'>Password is required.</p>
                                }
                                {
                                    errors.password?.type === 'minLength' && <p className='text-red-500'>
                                        Password must be 6 characters or longer
                                    </p>
                                }
                                {
                                    errors.password?.type === 'pattern' && <p className='text-red-500'>Password must have at least one uppercase, one lowercase, and at least 6 characters</p>
                                }

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {/* Forgot Password */}
                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-teal-600 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 bg-white hover:bg-gray-100 transition cursor-pointer text-teal-600"
                    >
                        <img
                            src="https://www.svgrepo.com/show/355037/google.svg"
                            alt="google"
                            className="w-5 h-5 "
                        />
                        Continue with Google
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-gray-600 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/auth/register"
                            className="text-teal-600 hover:underline font-semibold"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
