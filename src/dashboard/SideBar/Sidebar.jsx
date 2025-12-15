import { use, useState } from 'react'
import { Link } from 'react-router'
import logo from '../../assets/ticket-bari.jpg'
// Icons
import { GrLogout } from 'react-icons/gr'
import { FcSettings } from 'react-icons/fc'
import { AiOutlineBars } from 'react-icons/ai'
import { BsGraphUp } from 'react-icons/bs'

// User Menu

import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner'
import UserMenu from '../Menu/UserMenu'
import VendorMenu from '../Menu/VendorMenu'
import AdminMenu from '../Menu/AdminMenu'
import { AuthContext } from '../../Provider/AuthProvider'
import MenuItem from '../Menu/MenuItem'
import useRole from '../../hooks/useRole'


const Sidebar = () => {
  const { logOut } = use(AuthContext)
  const [isActive, setActive] = useState(false)
  const [role, isRoleLoading] = useRole()

  // Sidebar Responsive Handler
  const handleToggle = () => {
    setActive(!isActive)
  }

  if (isRoleLoading) return <LoadingSpinner></LoadingSpinner>

  return (
    <>
      {/* Small Screen Navbar, only visible till md breakpoint */}
      <div className='dark:bg-red-100 text-black flex justify-between md:hidden'>
        <div>
          <div className='block cursor-pointer p-4 font-bold '>
            <Link to='/'>
              <div className='flex gap-1'>
                
                
              </div>
            </Link>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className='mobile-menu-button p-4 focus:outline-none focus:bg-gray-200'
        >
          <AiOutlineBars className='h-5 w-5' />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-10 md:fixed flex  flex-col justify-between overflow-x-hidden dark:bg-gray-400 w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform ${isActive && '-translate-x-full'
          }  md:translate-x-0  transition duration-200 ease-in-out`}
      >
        <div className='flex flex-col h-full'>
          {/* Top Content */}
          <div>
            {/* Logo */}
            <div className='w-full  md:flex px-4 py-1 shadow-lg rounded-lg bg-teal-100 dark:bg-teal-100 mx-auto'>
              <Link to='/' className='flex items-center gap-2'>
                <img
                  src={logo}
                  alt='logo'
                  className='w-10 h-10 rounded-xl'
                />
                <span className='text-xl font-bold text-teal-600'>
                  Ticketbari
                </span>
              </Link>
            </div>

          </div>

          {/* Middle Content */}
          <div className='flex flex-col justify-between flex-1 mt-6'>
            {/*  Menu Items */}
            <nav className='hover:text-teal-300'>

              {/* Role-Based Menu */}
              {role === 'user' && <UserMenu></UserMenu>}
              {role === 'vendor' && <VendorMenu></VendorMenu>}
              {role === 'admin' && <AdminMenu></AdminMenu>}
            </nav>
          </div>

          {/* Bottom Content */}
          <div>
            <hr  className='text-black'/>

            {/* <MenuItem
              icon={FcSettings}
              label='Profile'
              address='/dashboard/profile'
            /> */}
            <button
              onClick={logOut}
              className='flex cursor-pointer w-full items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-300   hover:text-gray-700 transition-colors duration-300 transform'
            >
              <GrLogout className='w-5 h-5' />

              <span className='mx-4 font-medium'>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar