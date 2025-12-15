import coverImg from '../../../assets/coverimage_ticket.avif'
import { use, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../../Provider/AuthProvider'
import { RxCross1 } from "react-icons/rx";
import useRole from '../../../hooks/useRole'
import { saveOrUpdateUser } from '../../../utils/Index'
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner'

const Profile = () => {
  const { user, updateUser, setUser } = use(AuthContext)
  const [role, isRoleLoading] = useRole()
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Spinner while role loads
  if (isRoleLoading) return <LoadingSpinner />

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
      setUser({
        ...user,
        displayName: name,
        photoURL: photo,
      })

      // Update database user info
      const userData = {
        name,
        email: user.email,
        image: photo,
        role,
      }

      await saveOrUpdateUser(userData)

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
            {role}
          </p>

          <p className="mt-2 text-xl font-medium">
            User Id: {user?.uid}
          </p>

          <div className="w-full mt-6 grid grid-cols-1 items-center md:grid-cols-3 text-sm gap-4">
            <div>
              <p>Name</p>
              <p className="font-bold">{user?.displayName}</p>
            </div>

            <div>
              <p>Email</p>
              <p className="font-bold">{user?.email}</p>
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

            <h2 className="text-xl font-semibold mb-4">
              Update Profile
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user?.displayName}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Photo URL</label>
                <input
                  type="text"
                  name="photo"
                  defaultValue={user?.photoURL}
                  className="w-full border rounded px-3 py-2"
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
