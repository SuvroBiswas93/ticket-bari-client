import React from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram } from "lucide-react"
import apple from '../assets/Apple_Pay-Logo.wine.svg'
import stripe from '../assets/Stripe_Logo,_revised_2016.svg.png'
import masterCard from '../assets/visa-mastercard-logos-wh429a8o742pgm38.png'
import paypal from '../assets/paypal_PNG7.png'
import ticketbariImg from '../assets/ticket-bari.jpg'
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
     const currentYear = new Date().getFullYear()
    return (
        <footer className="bg-slate-900 dark:bg-black text-white mt-20 border-t border-slate-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <Link to='/'>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9  flex items-center justify-center">
                                    <span ><img src={ticketbariImg}alt="" className='rounded-lg' /></span>
                                </div>
                                <span className="font-bold text-2xl text-teal-600">TicketBari</span>
                            </div>
                            <p className="text-slate-400 text-sm">Your trusted platform for hassle-free ticket booking. Book bus, train, launch, and flight tickets easily. Where convenience meets reliability,your journey begins with effortless booking.
                            </p>
                        </div>
                    </Link>

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
                            <div className="px-3 py-1 bg-slate-800 rounded text-xs flex justify-center items-center gap-1"><span className='bg-white w-6 h-6 rounded-xl flex items-center'><img src={stripe} alt="" /></span> Stripe</div>
                            <div className="px-3 py-1 bg-slate-800 rounded text-xs flex justify-center items-center gap-1"><span className='bg-white w-6 h-6 rounded-xl flex items-center'><img src={masterCard} alt="" /></span> Mastercard</div>
                            <div className="px-3 py-1 bg-slate-800 rounded text-xs flex justify-center items-center gap-1"><span className='bg-white w-6 h-6 rounded-xl flex items-center'><img src={paypal} alt="" /></span> PayPal</div>
                            <div className="px-3 py-1 bg-slate-800 rounded text-xs flex justify-center items-center gap-1"><span className='bg-white w-6 h-6 rounded-xl flex items-center'><img src={apple} alt="" /></span> Apple Pay</div>
                        </div>
                    </div>
                </div>

                {/* Social & Copyright */}
                <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">&copy; {currentYear} TicketBari. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link target='_blank' to='https://x.com/' className="text-slate-400 hover:text-teal-400 transition">
                            <FaXTwitter size={20} />
                        </Link>
                        <Link target='_blank' to="https://www.facebook.com/" className="text-slate-400 hover:text-teal-400 transition">
                            <Facebook size={20} />
                        </Link>
                        <Link target='_blank' to="https://www.instagram.com/" className="text-slate-400 hover:text-teal-400 transition">
                            <Instagram size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;