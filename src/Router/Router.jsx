import { createBrowserRouter } from "react-router";
import HomeLayout from "../Layouts/HomeLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import AuthLayout from "../Layouts/AuthLayout";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivateRoute from "../Provider/PrivateRoute";
import Profile from "../dashboard/Pages/Common/Profile";
import VendorRoute from "./VendorRoute";
import AddTicket from "../dashboard/Pages/Vendor/AddTciket";
import MyAddedTickets from "../dashboard/Pages/Vendor/MyAddedTickets";
import Payment from "../dashboard/Payment/Payment";
import PaymentSuccess from "../dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../dashboard/Payment/PaymentCancelled";
import MyBookedTickets from "../dashboard/Pages/User/MyBookedTickets";
import TransactionHistory from "../dashboard/Pages/User/TransactionHistory";
import UpdateTicket from "../dashboard/Pages/Vendor/UpdateTicket";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/all-tickets',
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword></ForgotPassword>
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout></AuthLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/auth/login',
        element: <Login></Login>
      },
      {
        path: '/auth/register',
        element: <Register></Register>
      }
    ]
  },
  {
    path: '/Dashboard',
    element: <PrivateRoute>
      <DashboardLayout></DashboardLayout>
    </PrivateRoute>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: 'profile',
        element: <PrivateRoute>
          <Profile></Profile>
        </PrivateRoute>
      },
      {
        path:'my-booked-tickets',
        element:<PrivateRoute>
          <MyBookedTickets></MyBookedTickets>
        </PrivateRoute>
      },
      {
        path:'transaction-history',
        element:<PrivateRoute>
          <TransactionHistory></TransactionHistory>
        </PrivateRoute>
      },
      {
        path: 'add-ticket',
        element: <PrivateRoute>
          <VendorRoute>
            <AddTicket></AddTicket>
          </VendorRoute>
        </PrivateRoute>
      },
      {
        path: 'my-added-tickets',
        element: <PrivateRoute>
          <VendorRoute>
            <MyAddedTickets></MyAddedTickets>
          </VendorRoute>
        </PrivateRoute>
      },
      {
        path: 'update-ticket/:id',  
        element: 
          <PrivateRoute>
            <VendorRoute>
              <UpdateTicket />
            </VendorRoute>
          </PrivateRoute>
        
      },
      {
        path:'payment/:bookingId',
        element:<Payment></Payment>
      },
      {
        path:'payment-success',
        element:<PaymentSuccess></PaymentSuccess>
      },
      {
        path:'Payment-cancelled',
        element:<PaymentCancelled></PaymentCancelled>
      }
    ]
  }
]);