import React, { use, useEffect, useState } from 'react';
import { Link, Navigate, NavLink, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import logo from '../assets/ticket-bari.jpg'
import { motion } from "framer-motion";
import { AuthContext } from '../Provider/AuthProvider';
import { Menu, X, Moon, Sun, LogOut, User, Home, Ticket, LayoutDashboard } from 'lucide-react';

const MotionLink = motion(Link);

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logOut } = use(AuthContext)
    const location = useLocation()
    console.log(location)


    // const loginTime = localStorage.getItem("loginTime");

    // Theme Toggling

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

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
    const isDashboard = location.pathname.includes('Dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm z-50 transition-all duration-300 ${
                isDashboard ? 'md:left-64' : ''
            }`}
        >
            <div className="h-full px-4 sm:px-6 lg:px-8 mx-auto flex items-center justify-between">
                {/* Left section (Logo + Mobile Menu) */}
                <div className="flex items-center gap-4">
                    {/* Sidebar toggle button - only show in dashboard */}
                    {isDashboard && setSidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}
                    
                    {/* Mobile menu button - only show when NOT in dashboard */}
                    {!isDashboard && (
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img 
                            src={logo} 
                            alt="TicketBari Logo" 
                            className="w-10 h-10 rounded-lg group-hover:scale-105 transition-transform" 
                        />
                        <span className="text-xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent hidden sm:block">
                            TicketBari
                        </span>
                    </Link>
                </div>

                {/* Center menu (Desktop only) */}
                <div className="hidden lg:flex items-center gap-1">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`
                        }
                    >
                        <div className="flex items-center gap-2">
                            <Home size={16} />
                            Home
                        </div>
                    </NavLink>
                    <NavLink
                        to="/all-tickets"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`
                        }
                    >
                        <div className="flex items-center gap-2">
                            <Ticket size={16} />
                            All Tickets
                        </div>
                    </NavLink>
                    {user && (
                        <NavLink
                            to="/Dashboard"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`
                            }
                        >
                            <div className="flex items-center gap-2">
                                <LayoutDashboard size={16} />
                                Dashboard
                            </div>
                        </NavLink>
                    )}
                </div>

                {/* Right section (User menu / Auth buttons) */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="cursor-pointer">
                                <div className="w-10 h-10 rounded-full ring-2 ring-teal-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 overflow-hidden hover:ring-teal-600 transition">
                                    <img
                                        src={user?.photoURL || 'https://img.daisyui.com/images/profile/demo/spiderperson@192.webp'}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-56 p-2 mt-2 z-50"
                            >
                                <li className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                                    <div className="font-semibold text-slate-900 dark:text-white">
                                        {user?.displayName || 'User'}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {user?.email}
                                    </div>
                                </li>
                                <li>
                                    <NavLink
                                        to="/Dashboard/profile"
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 px-3 py-2 rounded-lg ${
                                                isActive
                                                    ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`
                                        }
                                    >
                                        <User size={16} />
                                        My Profile
                                    </NavLink>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <MotionLink
                                to="/auth/login"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition"
                            >
                                Login
                            </MotionLink>
                            <MotionLink
                                to="/auth/register"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-linear-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg transition"
                            >
                                Register
                            </MotionLink>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {!isDashboard && mobileMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg">
                    <div className="px-4 py-4 space-y-2">
                        <NavLink
                            to="/"
                            end
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-3 rounded-lg ${
                                    isActive
                                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`
                            }
                        >
                            <Home size={20} />
                            Home
                        </NavLink>
                        <NavLink
                            to="/all-tickets"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-3 rounded-lg ${
                                    isActive
                                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`
                            }
                        >
                            <Ticket size={20} />
                            All Tickets
                        </NavLink>
                        {user && (
                            <NavLink
                                to="/Dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-3 rounded-lg ${
                                        isActive
                                            ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`
                                }
                            >
                                <LayoutDashboard size={20} />
                                Dashboard
                            </NavLink>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;