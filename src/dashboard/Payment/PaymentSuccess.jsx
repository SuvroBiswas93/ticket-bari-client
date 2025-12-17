import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import { 
  CheckCircle2, 
  CreditCard, 
  Ticket, 
  DollarSign, 
  Calendar, 
  ArrowLeft,
  AlertCircle,
  Receipt
} from "lucide-react";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const axiosSecure = useAxiosSecure();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        if (sessionId) {
            const updatePayment = async () => {
                try {
                    const res = await axiosSecure.post(
                        `/payments/success`,
                        {
                            sessionId: sessionId
                        }
                    );
                    setPaymentInfo(res.data?.data);
                } catch (err) {
                    console.error(err.response?.data?.message || "Failed to update payment");
                } finally {
                    setLoading(false);
                }
            };
            updatePayment();
        } else {
            toast.error("No session ID found"); 
            setLoading(false);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
    }, [sessionId, axiosSecure, navigate]);

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) return <LoadingSpinner />;

    if (!paymentInfo) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
                        Payment Processing Failed
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        There was an issue processing your payment. Please try again.
                    </p>
                    <Link 
                        to="/dashboard/my-booked-tickets"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    >
                        <ArrowLeft size={18} />
                        Back to My Booked Tickets
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center mb-6">
                    <div className="mb-6">
                        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="text-green-600 dark:text-green-400" size={48} />
                        </div>
                        <h2 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                            Payment Successful!
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Your payment has been processed successfully
                        </p>
                    </div>

                    {/* Payment Details Card */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 space-y-4 mb-6 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-slate-500 dark:text-slate-400" size={20} />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Transaction ID
                                </span>
                            </div>
                            <span className="text-sm font-mono text-slate-900 dark:text-white">
                                {paymentInfo.paymentId || "N/A"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <Ticket className="text-slate-500 dark:text-slate-400" size={20} />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Ticket Title
                                </span>
                            </div>
                            <span className="text-sm text-slate-900 dark:text-white font-medium">
                                {paymentInfo.ticketTitle ||  "N/A"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <DollarSign className="text-teal-600 dark:text-teal-400" size={20} />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Amount Paid
                                </span>
                            </div>
                            <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                                ৳ {paymentInfo.ticketPrice?.toLocaleString() || paymentInfo.ticketPrice || "0"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <Calendar className="text-slate-500 dark:text-slate-400" size={20} />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Payment Date
                                </span>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {formatDate(paymentInfo.paymentDate || paymentInfo.paidAt)}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link 
                            to="/dashboard/my-booked-tickets"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                        >
                            <Receipt size={18} />
                            View My Bookings
                        </Link>
                        <Link 
                            to="/dashboard/transaction-history"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            <Receipt size={18} />
                            Transaction History
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
