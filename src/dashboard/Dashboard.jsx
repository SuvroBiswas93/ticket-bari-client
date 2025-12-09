import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBell,
  FaWhatsapp,
  FaTelegram,
  FaLifeRing,
  FaInfoCircle,
  FaGlobe,
  FaLock,
  FaStar,
  FaCog,
  FaSignOutAlt,
  FaBars, // মেনু আইকন
  FaTimes, // ক্রস আইকন
} from "react-icons/fa";


const menuItems = [
  { name: "হোম", path: "/Dashboard/HomePage", icon: <FaHome /> },
  { name: "প্রোফাইল", path: "/Dashboard/Profile", icon: <FaUser /> },
  { name: "নোটিফিকেশন", path: "notification", icon: <FaBell /> },
  { name: "হোয়াটসঅ্যাপ গ্রুপ", path: "whatsapp-group", icon: <FaWhatsapp /> },
 
];

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex min-h-screen">
      
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md text-gray-800 bg-white shadow-lg md:hidden"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* 1. ফিক্সড সাইডবার */}
      <aside
        className={`
          w-64 bg-gray-800 text-white p-6 flex-col h-full z-40 transition-transform duration-300
          
          // মোবাইল স্টাইল: ফিক্সড, বাম দিকে লুকিয়ে থাকে, isOpen হলে সামনে আসে
          fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0 flex' : '-translate-x-full hidden'}
          
          // ডেস্কটপ স্টাইল: সবসময় দৃশ্যমান, ফিক্সড
          md:translate-x-0 md:flex
          md:fixed
          `}
      >
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-3 overflow-y-auto">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              // মোবাইল বন্ধ করার জন্য ক্লিক হ্যান্ডলার যোগ করা যেতে পারে
              onClick={() => setIsOpen(false)} 
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
      
      {/* সাইডবার খোলা থাকলে মোবাইলে ওভারলে (ঐচ্ছিক) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 2. মেইন কনটেন্ট */}
      <main className="flex-1 p-6 bg-gray-100 ml-0 md:ml-64">
        <Outlet />
      </main>
      
    </div>
  );
}