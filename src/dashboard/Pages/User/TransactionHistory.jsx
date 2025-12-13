import React, { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../../Provider/AuthProvider";


const TransactionHistory = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [transactions, setTransactions] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const fetchPayments = async () => {
      try {
        setDataLoading(true);
        const res = await axiosSecure.get(`/payments/user/${user.email}`);
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchPayments();
  }, [user, axiosSecure]);

  if (loading || dataLoading) return <LoadingSpinner />;

  if (transactions.length === 0) return <p>No transactions found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Transaction History</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Transaction ID</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Ticket Title</th>
            <th className="p-2 border">Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(txn => (
            <tr key={txn._id} className="text-center">
              <td className="p-2 border">{txn.transactionId}</td>
              <td className="p-2 border">${txn.amount}</td>
              <td className="p-2 border">{txn.parcelName}</td>
              <td className="p-2 border">{new Date(txn.paidAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
