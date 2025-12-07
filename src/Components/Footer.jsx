import React from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram } from "lucide-react"

const Footer = () => {
    return (
        <footer className="bg-slate-900 dark:bg-black text-white mt-20 border-t border-slate-700">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-linear-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">TB</span>
                            </div>
                            <span className="font-bold text-lg">TicketBari</span>
                        </div>
                        <p className="text-slate-400 text-sm">Your trusted platform for booking tickets hassle-free.Book bus, train, launch & flight tickets easily</p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Quick Links</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li>
                                <Link to="/" className="hover:text-teal-400 transition">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/all-tickets" className="hover:text-teal-400 transition">
                                    All Tickets
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-teal-400 transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-teal-400 transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Contact Us</h4>
                        <div className="space-y-2 text-slate-400 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail size={16} />
                                <a href="mailto:info@ticketbari.com" className="hover:text-teal-400 transition">
                                    info@ticketbari.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} />
                                <a href="tel:+1234567890" className="hover:text-teal-400 transition">
                                    +880170000000
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>18 Main St, Dhaka, Bangladesh</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Payment Methods</h4>
                        <div className="flex gap-3 flex-wrap">
                            <div className="px-3 py-1 bg-slate-800 rounded text-xs">Stripe</div>
                            <div className="px-3 py-1 bg-slate-800 rounded text-xs">Mastercard</div>
                            <div className="px-3 py-1 bg-slate-800 rounded text-xs">PayPal</div>
                            <div className="px-3 py-1 bg-slate-800 rounded text-xs">Apple Pay</div>
                        </div>
                    </div>
                </div>

                {/* Social & Copyright */}
                <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">© 2025 TicketBari. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="text-slate-400 hover:text-teal-400 transition">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-teal-400 transition">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-teal-400 transition">
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;