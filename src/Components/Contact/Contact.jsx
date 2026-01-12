import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange", // instant validation
  });

  const onSubmit = (data) => {
    console.log(data);
    toast.success("Message sent successfully!");
    reset();
  };

  return (
    <section className="py-24 bg-linear-to-br from-teal-800 via-teal-700 to-teal-600 text-white">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">Contact Us</h2>
          <p className="text-teal-200 max-w-2xl mx-auto">
            Have questions or need assistance? Fill out the form below and we’ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-slate-900 p-8 rounded-2xl shadow-lg flex flex-col gap-6"
          >
            {/* Name */}
            <div>
              <label className="block mb-2 font-medium text-slate-200">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                {...register("name", { required: "Name is required" })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${
                  errors.name ? "border-red-500" : "border-white/10"
                } text-white focus:outline-none focus:ring-2 focus:ring-teal-400`}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium text-slate-200">Email</label>
              <input
                type="email"
                placeholder="Your Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${
                  errors.email ? "border-red-500" : "border-white/10"
                } text-white focus:outline-none focus:ring-2 focus:ring-teal-400`}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Subject */}
            <div>
              <label className="block mb-2 font-medium text-slate-200">Subject</label>
              <input
                type="text"
                placeholder="Subject"
                {...register("subject", { required: "Subject is required" })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${
                  errors.subject ? "border-red-500" : "border-white/10"
                } text-white focus:outline-none focus:ring-2 focus:ring-teal-400`}
              />
              {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 font-medium text-slate-200">Message</label>
              <textarea
                placeholder="Your Message"
                rows={5}
                {...register("message", { required: "Message is required" })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${
                  errors.message ? "border-red-500" : "border-white/10"
                } text-white focus:outline-none focus:ring-2 focus:ring-teal-400`}
              />
              {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              className="mt-4 bg-teal-400 cursor-pointer hover:bg-teal-500 text-slate-950 font-semibold px-6 py-3 rounded-xl transition-colors shadow-md"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col justify-center gap-8 text-slate-50">
            <div>
              <h3 className="text-2xl font-bold mb-3">Get in Touch</h3>
              <p>You can also reach us via email or phone.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-teal-400 text-xl">📧</span>
                <p>info@ticketbari.com</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-teal-400 text-xl">📞</span>
                <p>+8801758197272</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-teal-400 text-xl">📍</span>
                <p>18 Main St, Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
