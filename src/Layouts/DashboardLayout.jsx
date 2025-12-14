import { Outlet } from 'react-router'
import Sidebar from '../dashboard/SideBar/Sidebar'
import Navbar from '../Components/Navbar'


const DashboardLayout = () => {
  return (
    <div className='relative min-h-screen pt-[47px] md:flex bg-white'>
      {/* Left Side: Sidebar Component */}
      <Sidebar></Sidebar>

      {/* Right Side: Dashboard Dynamic Content */}
      <div className='flex-1  md:ml-64'>
        <div className='p-5'>
             <Navbar/>
          {/* Outlet for dynamic contents */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout