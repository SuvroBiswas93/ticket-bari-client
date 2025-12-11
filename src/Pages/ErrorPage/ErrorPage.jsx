import React from 'react';
import { Link, useRouteError } from 'react-router';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import errorImg from '../../assets/errorImg.webp'

const ErrorPage = () => {
    const error = useRouteError()
    return (
        <div >
            <>
                <Navbar></Navbar>
                {/* <div>{error.message}</div> */}
                <div className=' flex flex-col justify-center items-center space-y-3 mt-18 px-4'>
                    <img src={errorImg} alt='Error Image' className='rounded-xl' />
                    <h1 className='text-3xl font-bold'>Oops, page not found!!</h1>
                    <p className="text-muted ">
                        {error?.statusText || error?.message || "The page you are looking for is not available."}
                    </p>
                    <Link to='/'

                        className="btn bg-teal-500 hover:bg-teal-700 text-white border-none"
                    >
                        Go Back !

                    </Link>

                </div>

                <Footer></Footer>

            </>
        </div>
    );
};

export default ErrorPage;