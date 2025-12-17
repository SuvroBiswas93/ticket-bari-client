import { NavLink } from 'react-router'

const MenuItem = ({ label, address, icon: Icon }) => {
  return (
    <NavLink
      to={address}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive
            ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold shadow-sm'
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`
      }
    >
      {Icon && <Icon size={20} className="w-5 h-5" />}
      <span className='font-medium'>{label}</span>
    </NavLink>
  )
}

export default MenuItem
