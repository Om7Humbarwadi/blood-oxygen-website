import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ActivityItem from "../components/dashboard/ActivityItem";
import ChartCard from "../components/dashboard/ChartCard";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import StatCard from "../components/dashboard/StatCard";
import { useRealtime } from "../context/RealtimeContext";
import {
  bloodUsageTrend,
  donationTrend,
  emergencyStats,
  oxygenDemand,
  recentActivities,
  statsData,
} from "../data/dashboardData";

const PIE_COLORS = ["#e11d48", "#f43f5e", "#fb7185", "#fecdd3"];

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const { activities } = useRealtime();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(timer);
  }, []);

  const mergedActivities = useMemo(() => {
    const live = activities.map((item, index) => ({
      id: `live-${item.id}-${index}`,
      title: item.title,
      detail: item.message,
      time: new Date(item.createdAt).toLocaleTimeString(),
      priority:
        item.type === "new-emergency"
          ? "critical"
          : item.type === "donor-assigned"
            ? "warning"
            : "normal",
    }));

    return [...live, ...recentActivities].slice(0, 8);
  }, [activities]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statsData.map((item) => (
          <StatCard key={item.id} label={item.label} value={item.value} change={item.change} tone={item.tone} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Blood Usage Trends" subtitle="Daily unit consumption across emergency centers">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bloodUsageTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="usage" stroke="#e11d48" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Donation Trends" subtitle="Weekly donor participation levels">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={donationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="donors" stroke="#be123c" fill="#fecdd3" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Oxygen Demand" subtitle="Department-wise oxygen requirement">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={oxygenDemand}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="#dc2626" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Emergency Statistics" subtitle="Current request severity distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={emergencyStats} cx="50%" cy="50%" labelLine={false} outerRadius={95} dataKey="value" label>
                {emergencyStats.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">Live Activity Feed</h3>
          <p className="text-xs text-slate-500">Realtime events across emergency requests and inventory</p>
        </div>
        <div className="space-y-3">
          {mergedActivities.map((activity) => (
            <ActivityItem key={activity.id} {...activity} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
