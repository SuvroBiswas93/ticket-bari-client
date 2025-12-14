import React, { use, useEffect, useState } from 'react';
import { Link, Navigate, NavLink, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import logo from '../assets/ticket-bari.jpg'
import { motion } from "framer-motion";
import { AuthContext } from '../Provider/AuthProvider';

const MotionLink = motion(Link);

const Navbar = () => {
    const { user, logOut } = use(AuthContext)
    const location = useLocation()
    console.log(location)


    // const loginTime = localStorage.getItem("loginTime");

    // Theme Toggling
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") === "light" ? "light" : "dark"
    );
    useEffect(() => {

        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

    }, [theme]);

    const handleThemeToggle = (e) => {
        setTheme(e.target.checked ? "dark" : "light");
    };

    const handleLogout = () => {
        logOut()
            .then(() => {
                // localStorage.removeItem("loginTime");
                toast.success("You Logged Out successfully");
            })
            .catch((error) => {
                toast.error(error);
            });
    }
    return (
        <div
            className={`navbar bg-base-100 shadow-sm fixed top-0 left-0 right-0 w-full 
  ${location.pathname.includes('Dashboard')
                    ? 'md:left-auto md:w-[81.2%] md:right-0'
                    : 'w-full'
                }z-50`}
        >
            <div className="container  mx-auto  sm:px-6 lg:px-8 flex justify-between items-center">
                {/* Left section (Logo + Dropdown) */}
                <div className="flex items-center gap-1 shrink-0 ">
                    {/* Mobile dropdown */}
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow mt-3 w-40 p-2 z-100"
                        >
                            <li>
                                <NavLink to="/" end
                                    className={({ isActive }) =>
                                        isActive ? 'text-teal-600 font-semibold' : ''
                                    }>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/all-tickets"
                                    className={({ isActive }) =>
                                        isActive ? 'text-teal-600 font-semibold' : ''
                                    }>
                                    All Tickets
                                </NavLink>
                            </li>


                            {
                                user && (<>
                                    <li>
                                        <NavLink to="/dashboard"
                                            className={({ isActive }) =>
                                                isActive ? 'text-teal-600 font-semibold' : ''
                                            }>
                                            Dashboard
                                        </NavLink>
                                    </li>

                                </>)
                            }
                        </ul>
                    </div>

                    {/* Logo */}
                    <Link to="/" className="text-teal-600 flex items-center text-xl font-bold">
                        <img src={logo} alt="Logo" className="w-9 h-9 mr-1 rounded-lg" /> <span className='text-teal-600 text-2xl'>TicketBari</span>
                    </Link>
                </div>

                {/* Center menu (Desktop only) */}
                <div className="hidden lg:flex">
                    <ul className="menu-horizontal flex gap-6 font-semibold px-1">
                        <li>
                            <NavLink to="/" end
                                className={({ isActive }) =>
                                    isActive ? 'text-teal-600 border-b-2 border-teal-600 pb-1' : ''
                                }>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/all-tickets"
                                className={({ isActive }) =>
                                    isActive ? 'text-teal-600 border-b-2 border-teal-600 pb-1' : ''
                                }>
                                All Tickets
                            </NavLink>
                        </li>



                        {/* when user login the navabar should contains */}

                        {
                            user && (<>
                                <li>
                                    <NavLink to="/Dashboard"
                                        className={({ isActive }) =>
                                            isActive ? 'text-teal-600 font-semibold' : ''
                                        }>
                                        Dashboard
                                    </NavLink>
                                </li>




                            </>)
                        }
                    </ul>
                </div>

                {/* div image thakbe state true false */}


                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="avatar cursor-pointer">
                            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img
                                    src={
                                        user?.photoURL ||
                                        'https://img.daisyui.com/images/profile/demo/spiderperson@192.webp'
                                    }
                                    alt="User Avatar"
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow-md mt-3 w-48 p-2 z-100"
                        >
                            <li className="text-center font-semibold text-gray-700 py-1">
                                {user?.displayName || 'User'}
                            </li>

                            <li className="text-center font-semibold text-gray-700 py-1">
                                {user?.email || 'User'}
                            </li>

                            <li>
                                <NavLink
                                    to="/my-profile"
                                    className={({ isActive }) =>
                                        `block text-center py-1 px-2 rounded ${isActive
                                            ? 'text-teal-600 border-b-2 border-teal-600 font-bold'
                                            : 'text-gray-700 hover:text-teal-600 dark:bg-white'
                                        }`
                                    }
                                >
                                    My Profile
                                </NavLink>
                            </li>

                            {/* <li className="text-center text-sm text-gray-500 py-1">
                                Login: {loginTime || 'Unknown'}
                            </li> */}
                            <div className="divider my-1"></div>
                            <li className="flex justify-center items-center py-2">
                                <input
                                    type="checkbox"
                                    checked={theme === "dark"}
                                    onChange={handleThemeToggle}
                                    className="toggle p-1 toggle-success bg-gray-300 border-gray-400 checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-300 scale-110"
                                />
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="btn bg-red-400 text-white hover:bg-red-600 w-full"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex justify-center items-center gap-2 shrink-0">
                        <input
                            type="checkbox"
                            checked={theme === "dark"}
                            onChange={handleThemeToggle}
                            className="toggle p-1 toggle-success bg-gray-300 border-gray-400 checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-300 scale-110"
                        />
                        <MotionLink

                            to="/auth/login"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-sm lg:btn-md text-teal-500 "
                        >
                            Login
                        </MotionLink>
                        <MotionLink
                            to="/auth/register"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-sm lg:btn-md bg-teal-500 text-white hover:bg-teal-600"
                        >
                            Register
                        </MotionLink>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;