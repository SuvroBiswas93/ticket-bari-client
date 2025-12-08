import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';

const AuthLayout = () => {
    return (
        <div className='min-h-screen flex flex-col'>
            <header >

                <Navbar></Navbar>

            </header>
            <main className='w-11/12 mx-auto py-5 flex-1 '>
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