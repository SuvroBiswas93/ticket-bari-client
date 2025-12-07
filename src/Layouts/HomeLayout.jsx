import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer';
import { ToastContainer } from 'react-toastify';

const HomeLayout = () => {
    return (
        <div>
            <div className='min-h-screen flex flex-col'>
            <nav className=''>
               <Navbar></Navbar>
            </nav>           
            <div className='flex-1  '>
                <Outlet></Outlet>
            </div>
            <footer>
                <Footer></Footer>
            </footer>
            <ToastContainer />
        </div>
        </div>
    );
};

export default HomeLayout;