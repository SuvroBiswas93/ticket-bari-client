import coverImg from '../../../assets/coverimage_ticket.avif'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../../Provider/AuthProvider'
import useRole from '../../../hooks/useRole'
import { saveOrUpdateUser } from '../../../utils/Index'
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner'

const Profile = () => {
  const { user } = useContext(AuthContext)
  const [role, isRoleLoading] = useRole()
  const [saving, setSaving] = useState(false)

  const handleSaveOrUpdateUser = async () => {
    if (!user) return

    const userData = {
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
      role,
    }

    try {
      setSaving(true)
      await saveOrUpdateUser(userData)
      toast.success('Profile updated successfully ')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update profile ')
    } finally {
      setSaving(false)
    }
  }

  // Show spinner while role is loading
  if (isRoleLoading) return <LoadingSpinner />

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='bg-white shadow-lg rounded-2xl md:w-4/5 lg:w-3/5'>
        <img
          alt='cover photo'
          src={coverImg}
          className='w-full mb-4 rounded-t-lg h-56'
        />

        <div className='flex flex-col items-center p-4 -mt-16'>
          <img
            alt='profile'
            src={user?.photoURL}
            className='h-24 w-24 rounded-full border-2 border-white'
          />

          <p className='px-4 py-1 text-xs text-white bg-lime-500 rounded-full'>
            {role}
          </p>

          <p className='mt-2 text-xl font-medium'>
            User Id: {user?.uid}
          </p>

          <div className='w-full mt-4 flex justify-between text-sm'>
            <div>
              <p>Name</p>
              <p className='font-bold'>{user?.displayName}</p>
            </div>

            <div>
              <p>Email</p>
              <p className='font-bold'>{user?.email}</p>
            </div>

            <div>
              <button
                onClick={handleSaveOrUpdateUser}
                disabled={saving}
                className={`px-6 py-1 rounded text-white ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-lime-500 hover:bg-lime-700'
                }`}
              >
                {saving ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
