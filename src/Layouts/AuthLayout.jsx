import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';

const AuthLayout = () => {
    return (
        <div className='min-h-screen flex flex-col '>
            <header >

                <Navbar></Navbar>

            </header>
            <main className='container sm:px-6 lg:px-8 mx-auto  flex-1 sm:pt-20 '>
                <Outlet></Outlet>
            </main>
            <footer >
                <Footer></Footer>
            </footer>
            <ToastContainer></ToastContainer>
        </div>
    );
};

export default AuthLayout;