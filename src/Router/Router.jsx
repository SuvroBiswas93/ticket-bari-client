import { createBrowserRouter } from "react-router";
import HomeLayout from "../Layouts/HomeLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Auth/Login";
import PrivateRoute from "../Provider/PrivateRoute";
import Register from "../Pages/Auth/Register";
import AuthLayout from "../Layouts/AuthLayout";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import Dashboard from "../dashboard/Dashboard";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    errorElement:<ErrorPage></ErrorPage>,
    children:[
      {
        path:'/',
        element:<Home></Home>
      },
      {
        path:'/all-tickets',
      },
      {
        path:'/forgot-password',
        element: <ForgotPassword></ForgotPassword>
      }
    ]
  },
  {
    path:'/auth',
    element:<AuthLayout></AuthLayout>,
    errorElement:<ErrorPage></ErrorPage>,
    children:[
      {
        path:'/auth/login',
        element:<Login></Login>
      },
      {
        path:'/auth/register',
        element:<Register></Register>
      }
    ]
  },
  {
    path:'/Dashboard',
    element:<Dashboard></Dashboard>,
    errorElement:<ErrorPage></ErrorPage>,
    children:[
      // {
      //   path:'/auth/login',
      //   element:<Login></Login>
      // },
      // {
      //   path:'/auth/register',
      //   element:<Register></Register>
      // }
    ]
  }
]);