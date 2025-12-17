import React, { use, useEffect, useState } from "react";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { 
  DollarSign, 
  Ticket, 
  TrendingUp, 
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";

const COLORS = ["#14b8a6", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"];

const RevenueOverview = () => {
  const { user, loading } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [revenueData, setRevenueData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchRevenue = async () => {
      try {
        setDataLoading(true);
        const res = await axiosSecure.get(`/bookings/vendor/revenue`);
        setRevenueData(res.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchRevenue();
  }, [user?.email, axiosSecure]);

  if (loading || dataLoading) {
    return <LoadingSpinner />;
  }

  if (!revenueData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Failed to Load Revenue Data
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <TrendingUp className="text-teal-600" size={32} />
            Revenue Overview
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Track your earnings and ticket sales performance
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Revenue Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <DollarSign className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ৳ {revenueData.totalRevenue?.toLocaleString() || revenueData.totalRevenue || 0}
            </p>
          </div>

          {/* Total Tickets Sold Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Ticket className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
              Total Tickets Sold
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {revenueData.totalTicketsSold?.toLocaleString() || revenueData.totalTicketsSold || 0}
            </p>
          </div>

          {/* Total Tickets Added Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
              Total Tickets Added
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {revenueData.totalTicketsAdded?.toLocaleString() || revenueData.totalTicketsAdded || 0}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart: Tickets Sold per Ticket */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <BarChart3 className="text-teal-600 dark:text-teal-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Tickets Sold per Ticket
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={revenueData.ticketsData || []}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <XAxis 
                  dataKey="title" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="sold" 
                  name="Tickets Sold"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="revenue" 
                  name="Revenue (৳)"
                  fill="#14b8a6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart: Revenue Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <PieChartIcon className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Revenue Distribution
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={revenueData.ticketsData || []}
                  dataKey="revenue"
                  nameKey="title"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {revenueData.ticketsData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value) => `৳ ${value?.toLocaleString() || 0}`}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;
