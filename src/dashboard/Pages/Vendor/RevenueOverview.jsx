import React, { use, useEffect, useState } from "react";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF7", "#FF6F91"];

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
        const res = await axiosSecure.get(`/vendors/${user.email}/revenue`);
        setRevenueData(res.data);
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
      <div className="p-6">
        <h2 className="text-2xl font-bold text-red-600">
          Failed to load revenue data.
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-teal-700 mb-6">
        Revenue Overview
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-xl font-bold text-green-600">${revenueData.totalRevenue}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Total Tickets Sold</h3>
          <p className="text-xl font-bold text-blue-600">{revenueData.totalTicketsSold}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Total Tickets Added</h3>
          <p className="text-xl font-bold text-purple-600">{revenueData.totalTicketsAdded}</p>
        </div>
      </div>

      {/* Bar Chart: Tickets Sold per Ticket */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Tickets Sold per Ticket</h3>
        <BarChart
          width={600}
          height={300}
          data={revenueData.ticketsData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sold" fill="#8884d8" />
          <Bar dataKey="revenue" fill="#82ca9d" />
        </BarChart>
      </div>

      {/* Pie Chart: Revenue Distribution */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Revenue Distribution</h3>
        <PieChart width={400} height={400}>
          <Pie
            data={revenueData.ticketsData}
            dataKey="revenue"
            nameKey="title"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {revenueData.ticketsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default RevenueOverview;
