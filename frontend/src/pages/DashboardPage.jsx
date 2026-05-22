import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
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
import { emergencyService } from "../services/emergencyService";
import { authService } from "../services/authService";
import EmergencyRequestModal from "../components/emergency/EmergencyRequestModal";
import { ROLES } from "../utils/roles";
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
  const { activities, notifications } = useRealtime();

  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donorName, setDonorName] = useState("");
  const [forwardNotes, setForwardNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [pendingAccountsLoading, setPendingAccountsLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === ROLES.SUPER_ADMIN;

  const fetchPendingRequests = async () => {
    try {
      setRequestsLoading(true);
      const data = await emergencyService.list({ status: "PENDING", limit: 50 });
      setPendingRequests(data.items || []);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
    } finally {
      setRequestsLoading(false);
    }
  };

  const fetchPendingAccounts = async () => {
    if (!isAdmin) return;
    try {
      setPendingAccountsLoading(true);
      const data = await authService.listPendingUsers();
      setPendingAccounts(data || []);
    } catch (error) {
      console.error("Failed to fetch pending accounts:", error);
    } finally {
      setPendingAccountsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    if (isAdmin) {
      fetchPendingAccounts();
    }
    const timer = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  // Sync with real-time notifications
  useEffect(() => {
    if (notifications?.length > 0) {
      const latest = notifications[0];
      if (latest.type === "new-emergency" || latest.type === "request-approved") {
        fetchPendingRequests();
      }
    }
  }, [notifications]);

  const handleApprove = async (id) => {
    try {
      setSaving(true);
      await emergencyService.approve(id);
      toast.success("Emergency request approved successfully");
      fetchPendingRequests();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve request");
    } finally {
      setSaving(false);
    }
  };

  const handleForwardToApp = async (id, notes = "Forwarded to app due to unavailable stock") => {
    try {
      setSaving(true);
      await emergencyService.forwardToApp(id, notes);
      toast.success("Emergency request forwarded to app queue");
      fetchPendingRequests();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to forward request");
    } finally {
      setSaving(false);
    }
  };

  const runModalAction = async (actionFn, successMsg) => {
    if (!selectedRequest) return;
    try {
      setSaving(true);
      await actionFn();
      toast.success(successMsg);
      setSelectedRequest(null);
      setDonorName("");
      setForwardNotes("");
      fetchPendingRequests();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setSaving(false);
    }
  };

  const handleApproveAccount = async (id) => {
    try {
      setSaving(true);
      await authService.approvePendingUser(id);
      toast.success("Account approved successfully");
      fetchPendingAccounts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve account");
    } finally {
      setSaving(false);
    }
  };

  const handleRejectAccount = async (id) => {
    try {
      setSaving(true);
      await authService.rejectPendingUser(id, "Rejected by admin");
      toast.success("Account rejected successfully");
      fetchPendingAccounts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reject account");
    } finally {
      setSaving(false);
    }
  };

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

      {/* Pending Emergency Requests Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Pending Emergency Requests</h3>
              {pendingRequests.length > 0 && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">Urgent requests raised by hospitals awaiting administrator review and validation.</p>
          </div>
          {pendingRequests.length > 0 && (
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 animate-pulse">
              {pendingRequests.length} pending
            </span>
          )}
        </div>

        {requestsLoading ? (
          <div className="animate-pulse space-y-3 py-4">
            <div className="h-10 rounded-lg bg-slate-100" />
            <div className="h-10 rounded-lg bg-slate-100" />
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-slate-50 p-3 text-slate-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="mt-2 text-sm font-semibold text-slate-900">No pending emergency requests</h4>
            <p className="mt-1 text-xs text-slate-500 max-w-md">All patient emergency requests have been successfully triaged and processed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Details</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Hospital</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date/Time</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {pendingRequests.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.patientName}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{row.requestType || "BLOOD"}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {(row.requestType || "BLOOD") === "OXYGEN" ? `${row.oxygenUnits || "-"} units` : row.bloodGroup || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{row.hospital}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.priority === "CRITICAL" ? "bg-rose-100 text-rose-700" :
                        row.priority === "HIGH" ? "bg-orange-100 text-orange-700" :
                        row.priority === "MEDIUM" ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(row.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => handleApprove(row._id)}
                              disabled={saving}
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-1.5 px-3 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleForwardToApp(row._id)}
                              disabled={saving}
                              className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-1.5 px-3 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Forward to App
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 italic self-center mr-2">View Only</span>
                        )}
                        <button
                          onClick={() => setSelectedRequest(row)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isAdmin && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pending Hospital and Donor Accounts</h3>
              <p className="text-xs text-slate-500">Approve or reject account requests before they can log in.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
              {pendingAccounts.length} pending
            </span>
          </div>

          {pendingAccountsLoading ? (
            <div className="animate-pulse space-y-3 py-4">
              <div className="h-10 rounded-lg bg-slate-100" />
              <div className="h-10 rounded-lg bg-slate-100" />
            </div>
          ) : pendingAccounts.length === 0 ? (
            <p className="text-sm text-slate-500">No pending account requests.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Requested At</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {pendingAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{account.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{account.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{account.role}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date(account.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApproveAccount(account.id)}
                            disabled={saving}
                            className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-1.5 px-3 transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectAccount(account.id)}
                            disabled={saving}
                            className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-1.5 px-3 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

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

      {selectedRequest && (
        <EmergencyRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={() => runModalAction(() => emergencyService.approve(selectedRequest._id), "Request approved")}
          onForwardToApp={() => runModalAction(() => emergencyService.forwardToApp(selectedRequest._id, forwardNotes), "Request forwarded to app queue")}
          onAssign={() => runModalAction(() => emergencyService.assignDonor(selectedRequest._id, donorName), "Donor assigned")}
          onResolve={() => runModalAction(() => emergencyService.resolve(selectedRequest._id), "Request resolved")}
          loading={saving}
          donorName={donorName}
          setDonorName={setDonorName}
          forwardNotes={forwardNotes}
          setForwardNotes={setForwardNotes}
          showActions={isAdmin}
        />
      )}
    </div>
  );
};

export default DashboardPage;
