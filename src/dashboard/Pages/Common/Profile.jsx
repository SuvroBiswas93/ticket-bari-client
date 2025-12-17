import coverImg from '../../../assets/coverimage_ticket.avif'
import { use, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../../Provider/AuthProvider'
import { X, User, Mail, Edit2, Shield, Loader2 } from 'lucide-react'
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              alt="cover"
              src={coverImg}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          </div>

          {/* Profile Section */}
          <div className="flex flex-col items-center px-6 pb-8 -mt-20">
            {/* Profile Picture */}
            <div className="relative mb-4">
              <img
                alt="profile"
                src={user?.photoURL || 'https://via.placeholder.com/150'}
                className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-900 shadow-lg object-cover"
              />
              <div className="absolute bottom-0 right-0 p-2 bg-teal-600 rounded-full border-4 border-white dark:border-slate-900">
                <User className="text-white" size={16} />
              </div>
            </div>

            {/* Role Badge */}
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                <Shield size={14} />
                {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1) || 'User'}
              </span>
            </div>

            {/* User Info Cards */}
            <div className="w-full mt-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Card */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <User className="text-teal-600 dark:text-teal-400" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Name
                      </p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {user?.displayName || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <Mail className="text-teal-600 dark:text-teal-400" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white break-all">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User ID Card */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                  User ID
                </p>
                <p className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all">
                  {user?.uid}
                </p>
              </div>

              {/* Update Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Edit2 size={18} />
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <X className="text-slate-600 dark:text-slate-400" size={24} />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Update Profile
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Update your profile information
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user?.displayName}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Photo URL
                </label>
                <input
                  type="url"
                  name="photo"
                  defaultValue={user?.photoURL}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter a valid image URL
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
