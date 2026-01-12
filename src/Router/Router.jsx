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
import RequestedBookings from "../dashboard/Pages/Vendor/RequestedBookings";
import RevenueOverview from "../dashboard/Pages/Vendor/RevenueOverview";
import AdminRoute from "./AdminRoute";
import ManageTickets from "../dashboard/Pages/Admin/ManageTickets";
import ManageUsers from "../dashboard/Pages/Admin/ManageUsers";
import AdvertiseTickets from "../dashboard/Pages/Admin/AdvertiseTickets";
import TicketDetails from "../Pages/TicketDetails/TicketDetails";
import AdvertisementSection from "../Pages/Home/AdvertisementSection/AdvertisementSection";
import LatestTicketsSection from "../Pages/Home/LatestTicketsSection/LatestTicketsSection";
import AllTickets from "../Pages/AllTcikets/AllTickets";
import AboutUs from "../Pages/Home/AboutUs/AboutUs";
import Contact from "../Components/Contact/Contact";

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
        element: <AllTickets></AllTickets>
      },
      {
        path:'/about-us',
        element:<AboutUs />
      },
      {
        path:'/contact',
        element:<Contact />
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword></ForgotPassword>
      },
      {
        path:'/advertisements',
        element:<AdvertisementSection></AdvertisementSection>
      },
      {
        path:'latest-ticket',
        element:<LatestTicketsSection></LatestTicketsSection>
      },
      {
        path:'/ticket/:id',
        element: <TicketDetails></TicketDetails>
        
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

      // ====================== User Routes ==================

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

      // ================= Vendor Routes ====================

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
        path:'requested-bookings',
        element:
        <PrivateRoute>
          <VendorRoute>
            <RequestedBookings></RequestedBookings>
          </VendorRoute>
        </PrivateRoute>
      },
      {
        path:'revenue-overview',
        element:
        <PrivateRoute>
          <VendorRoute>
            <RevenueOverview></RevenueOverview>
          </VendorRoute>
        </PrivateRoute>
      },

      //================= Admin Routes =================

      {
        path:'manage-tickets',
        element:
        <PrivateRoute>
          <AdminRoute>
            <ManageTickets></ManageTickets>
          </AdminRoute>
        </PrivateRoute>
      },
      {
        path:'manage-users',
        element:
        <PrivateRoute>
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        </PrivateRoute>
      },
      {
        path:'advertise-tickets',
        element:
        <PrivateRoute>
          <AdminRoute>
            <AdvertiseTickets></AdvertiseTickets>
          </AdminRoute>
        </PrivateRoute>
      },

      //================= Payment Related Routes===================  

      {
        path:'payment/:bookingId',
        element:<Payment></Payment>
      },
    ]
  },
  {
    path:'payment/success',
    element:<PaymentSuccess></PaymentSuccess>
  },
  {
    path:'payment/cancel',
    element:<PaymentCancelled></PaymentCancelled>
  }
]);