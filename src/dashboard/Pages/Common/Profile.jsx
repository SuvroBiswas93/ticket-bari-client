import coverImg from '../../../assets/coverimage_ticket.avif'
import { use, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../../Provider/AuthProvider'
import { RxCross1 } from "react-icons/rx";
import useProfile from '../../../hooks/useProfile'
import { saveOrUpdateUser } from '../../../utils/Index'
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const Profile = () => {
  const { user, updateUser, setUser } = use(AuthContext)
  const [profile, isProfileLoading] = useProfile()
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure()

  // Spinner while role loads
  if (isProfileLoading) return <LoadingSpinner />

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!user) return

    const form = e.target
    const name = form.name.value
    const photo = form.photo.value

    try {
      setSaving(true)

      //  Update Firebase Auth (via AuthProvider)
      await updateUser({
        displayName: name,
        photoURL: photo,
      })

      // Update local user state (important for instant UI update)
     setUser(()=> {
      user.displayName = name
      user.photoURL = photo
      return user
     })

      // Update database user info
      const userData = {
        name: name,
        photoURL: photo,
      }

      await saveOrUpdateUser(axiosSecure,userData)

      toast.success('Profile updated successfully')
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex justify-center items-center pt-8 px-4">
      <div className="bg-white shadow-lg rounded-2xl md:w-4/5 lg:w-3/5 border-2 border-teal-600 overflow-hidden">
        <img
          alt="cover"
          src={coverImg}
          className="w-full mb-4 rounded-t-lg h-56"
        />

        <div className="flex flex-col items-center p-4 -mt-16">
          <img
            alt="profile"
            src={user?.photoURL}
            className="h-24 w-24 rounded-full border-2 border-white"
          />

          <p className="px-4 py-1 text-xs text-white bg-teal-500 rounded-full">
            {profile?.role}
          </p>

          <p className="mt-2 text-xl font-medium text-black">
            User Id: {user?.uid}
          </p>

          <div className="w-full mt-6 grid grid-cols-1 items-center md:grid-cols-3 text-sm gap-4">
            <div>
              <p className='text-black'>Name</p>
              <p className="font-bold text-black">{user?.displayName}</p>
            </div>

            <div>
              <p className='text-black'>Email</p>
              <p className="font-bold text-black">{user?.email}</p>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 rounded text-white bg-teal-500 hover:bg-teal-700 cursor-pointer"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-teal-500   hover:text-red-600 cursor-pointer"
            >
              <RxCross1 />
            </button>

            <h2 className="text-xl text-teal-500 font-semibold mb-4">
              Update Profile
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-sm text-black">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user?.displayName}
                  className="w-full border rounded px-3 py-2 text-black"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-black">Photo URL</label>
                <input
                  type="text"
                  name="photo"
                  defaultValue={user?.photoURL}
                  className="w-full border rounded px-3 py-2 text-black"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full py-2 rounded text-white cursor-pointer ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-500 hover:bg-teal-600'
                }`}
              >
                {saving ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
