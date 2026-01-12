import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Outlet, ScrollRestoration } from 'react-router';
import { ToastContainer } from 'react-toastify';
import FloatingCTA from '../Components/CTA/FloatingCTA';

const AuthLayout = () => {
    return (
        <div className='min-h-screen flex flex-col '>
            <ScrollRestoration></ScrollRestoration>
            <header >

                <Navbar></Navbar>

            </header>
            <main className='container sm:px-6 lg:px-8 mx-auto  flex-1 sm:pt-20 '>
                <Outlet></Outlet>
            </main>
            <footer >
                <Footer></Footer>
            </footer>
            <FloatingCTA />
            <ToastContainer position="top-right" autoClose={3000}></ToastContainer>
        </div>
    );
};

export default AuthLayout;