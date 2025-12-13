import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const axiosSecure = useAxiosSecure();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (sessionId) {
            const updatePayment = async () => {
                try {
                    const res = await axiosSecure.patch(
                        `/payment-success?session_id=${sessionId}`
                    );
                    // Expected response: { transactionId, amount, ticketTitle, paymentDate }
                    setPaymentInfo(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            updatePayment();
        }
    }, [sessionId, axiosSecure]);

    if (loading) return <LoadingSpinner />;

    if (!paymentInfo) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl text-red-600 mb-3">
                    Payment processing failed
                </h2>
                <Link to="/dashboard/my-booked-tickets"
                    className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                >
                    Back to My Booked Tickets
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-3xl font-bold text-green-600 mb-4">
                Payment Successful!
            </h2>

            <p className="mb-2">
                <strong>Transaction ID:</strong> {paymentInfo.transactionId}
            </p>
            <p className="mb-2">
                <strong>Ticket Title:</strong> {paymentInfo.ticketTitle}
            </p>
            <p className="mb-2">
                <strong>Amount Paid:</strong> ${paymentInfo.amount}
            </p>
            <p className="mb-4">
                <strong>Payment Date:</strong>{" "}
                {new Date(paymentInfo.paymentDate).toLocaleString()}
            </p>

            <Link to="/dashboard/my-booked-tickets"
                className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
            >

                Back to My Booked Tickets

            </Link>
        </div>
    );
};

export default PaymentSuccess;
