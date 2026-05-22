import { useMemo, useState } from "react";
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
import ChartCard from "../components/dashboard/ChartCard";
import StatCard from "../components/dashboard/StatCard";
import DateFilters from "../components/reports/DateFilters";
import InsightsPanel from "../components/reports/InsightsPanel";
import TrendCard from "../components/reports/TrendCard";
import {
  analyticsSummaryCards,
  bloodUsageMonthly,
  donationMonthly,
  emergencyAnalytics,
  insightItems,
  monthlyTrends,
  oxygenDemandMonthly,
} from "../data/reportsData";

const PIE_COLORS = ["#e11d48", "#f43f5e", "#fb7185", "#fecdd3"];

const ReportsAnalyticsPage = () => {
  const [range, setRange] = useState({ from: "2026-01-01", to: "2026-12-31" });

  const filteredSummary = useMemo(() => analyticsSummaryCards, [range]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
        <p className="mt-1 text-sm text-slate-600">Comprehensive healthcare operations analytics for blood, donors, oxygen, and emergency requests.</p>
      </section>

      <DateFilters range={range} onChange={setRange} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredSummary.map((item) => (
          <StatCard key={item.id} label={item.label} value={item.value} change={item.change} tone={item.tone} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Blood Usage Statistics" subtitle="Monthly blood utilization trends">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bloodUsageMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="units" stroke="#e11d48" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Donation Trends" subtitle="Monthly donor trend analysis">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={donationMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="donors" stroke="#be123c" fill="#fecdd3" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Oxygen Demand Reports" subtitle="ICU vs Emergency oxygen demand">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={oxygenDemandMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Bar dataKey="icu" fill="#dc2626" radius={[8, 8, 0, 0]} />
              <Bar dataKey="emergency" fill="#fb7185" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Emergency Request Analytics" subtitle="Current priority share">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={emergencyAnalytics} cx="50%" cy="50%" outerRadius={95} dataKey="value" label>
                {emergencyAnalytics.map((entry, index) => (
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
        <h3 className="text-base font-semibold text-slate-900">Monthly Trends</h3>
        <p className="mt-1 text-xs text-slate-500">Core performance indicators by month</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {monthlyTrends.map((trend) => (
            <TrendCard key={trend.label} {...trend} />
          ))}
        </div>
      </section>

      <InsightsPanel items={insightItems} />
    </div>
  );
};

export default ReportsAnalyticsPage;
