import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer';
import { ToastContainer } from 'react-toastify';

const HomeLayout = () => {
    return (
        <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950'>
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <main className='flex-1 pt-16'>
                <Outlet />
            </main>
            
            {/* Footer */}
            <footer>
                <Footer />
            </footer>
            
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default HomeLayout;