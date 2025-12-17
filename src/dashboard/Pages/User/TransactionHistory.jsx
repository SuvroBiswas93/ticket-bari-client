import React, { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../../Provider/AuthProvider";
import { 
  CreditCard, 
  Calendar, 
  Ticket, 
  AlertCircle,
  Receipt
} from "lucide-react";

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
        const res = await axiosSecure.get(`/payments/transactions`);
        setTransactions(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchPayments();
  }, [user, axiosSecure]);
  console.log(transactions);
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || dataLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Receipt className="text-teal-600" size={32} />
            Transaction History
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            View all your payment transactions
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="mx-auto text-slate-400 mb-4" size={64} />
            <p className="text-xl text-slate-600 dark:text-slate-400 font-semibold">
              No transactions found
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Your payment transactions will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {transactions.map((txn) => (
                    <tr 
                      key={txn._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CreditCard className="text-slate-500" size={16} />
                          <span className="text-sm font-mono text-slate-900 dark:text-white">
                            {txn.transactionId }
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Ticket className="text-slate-500" size={16} />
                          <span className="text-sm text-slate-900 dark:text-white font-medium">
                            { txn.ticketTitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                            ৳ {txn.amount?.toLocaleString() || txn.amount }
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-slate-500" size={16} />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(txn.updatedAt || txn.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
