import { Outlet } from 'react-router'
import { useState } from 'react'
import Sidebar from '../dashboard/SideBar/Sidebar'
import Navbar from '../Components/Navbar'
import { ToastContainer } from 'react-toastify'
import Profile from '../dashboard/Pages/Common/Profile'


const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='relative min-h-screen bg-slate-50 dark:bg-slate-950'>
      {/* Left Side: Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Right Side: Dashboard Dynamic Content */}
      <div className='md:ml-64'>
        {/* Navbar */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Main Content Area */}
        <main className='pt-16 min-h-screen'>
          <Outlet />
        </main>
        
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  )
}

export default DashboardLayout