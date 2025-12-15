import { Outlet } from 'react-router'
import Sidebar from '../dashboard/SideBar/Sidebar'
import Navbar from '../Components/Navbar'
import { ToastContainer } from 'react-toastify'
import Profile from '../dashboard/Pages/Common/Profile'


const DashboardLayout = () => {
  return (
    <div className='relative min-h-screen pt-[47px] md:flex bg-white'>
      {/* Left Side: Sidebar Component */}
      <Sidebar></Sidebar>

      {/* Right Side: Dashboard Dynamic Content */}
      <div className='flex-1  md:ml-64'>
        <div className=''>
             <Navbar/>
          {/* Outlet for dynamic contents */}
          <main className='dark:bg-gray-800 dark:h-screen'>
            <Outlet />
            
          </main>
          <ToastContainer position="top-right" autoClose={3000}></ToastContainer>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout