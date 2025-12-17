import React from 'react';
import useProfile from '../hooks/useProfile';
import LoadingSpinner from '../Components/LoadingSpinner/LoadingSpinner';
import { Navigate } from 'react-router';

const VendorRoute = ({children}) => {
   const [profile, isProfileLoading] = useProfile()
   if(isProfileLoading) return <LoadingSpinner></LoadingSpinner>
   if(profile?.role === 'vendor') return children
   return <Navigate to='/' replace='true'></Navigate>
};

export default VendorRoute;