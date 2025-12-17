import { use } from 'react'
import { Link } from 'react-router'
import logo from '../../assets/ticket-bari.jpg'
import { X, LogOut, Menu as MenuIcon } from 'lucide-react'
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner'
import UserMenu from '../Menu/UserMenu'
import VendorMenu from '../Menu/VendorMenu'
import AdminMenu from '../Menu/AdminMenu'
import { AuthContext } from '../../Provider/AuthProvider'
import MenuItem from '../Menu/MenuItem'
import useProfile from '../../hooks/useProfile'


const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logOut } = use(AuthContext)
  const [profile, isProfileLoading] = useProfile()

  // Close sidebar when clicking overlay
  const handleOverlayClick = () => {
    setIsOpen(false)
  }

  if (isProfileLoading) return <LoadingSpinner></LoadingSpinner>

  return (
    <>
      {/* Sidebar Overlay for mobile - only show when sidebar is open */}
      {isOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/50 z-40'
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className='flex flex-col h-full'>
          {/* Top Content - Logo */}
          <div className='p-6 border-b border-slate-200 dark:border-slate-700'>
            <Link to='/' className='flex items-center gap-3 group'>
              <img
                src={logo}
                alt='TicketBari Logo'
                className='w-10 h-10 rounded-lg group-hover:scale-105 transition-transform'
              />
              <div>
                <span className='text-xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent block'>
                  TicketBari
                </span>
                <span className='text-xs text-slate-500 dark:text-slate-400'>
                  Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* Middle Content - Menu Items */}
          <nav className='flex-1 overflow-y-auto p-4'>
            <div className='space-y-1'>
              {/* Role-Based Menu */}
              {profile?.role === 'user' && <UserMenu />}
              {profile?.role === 'vendor' && <VendorMenu />}
              {profile?.role === 'admin' && <AdminMenu />}
            </div>
          </nav>

          {/* Bottom Content - Logout */}
          <div className='p-4 border-t border-slate-200 dark:border-slate-700'>
            <button
              onClick={logOut}
              className='flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium'
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar