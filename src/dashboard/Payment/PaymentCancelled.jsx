import { Link } from "react-router";
import { XCircle, AlertCircle, ArrowLeft, Ticket, Clock } from "lucide-react";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Cancelled Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <XCircle className="text-red-600 dark:text-red-400" size={48} />
            </div>
            <h2 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
              Payment Cancelled
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Your payment was not completed
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 mb-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={20} />
              <div className="text-left">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                  Payment Not Completed
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  You can try again before the departure time. Your booking will remain pending until payment is completed.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link 
              to="/dashboard/my-booked-tickets"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              <Ticket size={18} />
              Back to My Booked Tickets
            </Link>
            <Link 
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
