import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from "react-router/dom";
import PrivateRoute from './Provider/PrivateRoute.jsx';
import { ToastContainer } from 'react-toastify';
import { router } from './Router/Router.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivateRoute>
       <RouterProvider router={router} />
    </PrivateRoute>
    <ToastContainer></ToastContainer>
  </StrictMode>,
)
