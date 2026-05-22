import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmergencyTable from "../components/emergency/EmergencyTable";
import EmergencyRequestModal from "../components/emergency/EmergencyRequestModal";
import Pagination from "../components/inventory/Pagination";
import { emergencyService } from "../services/emergencyService";

const initialForm = {
  patientName: "",
  bloodGroup: "A+",
  hospital: "",
  priority: "MEDIUM",
  notes: "",
};

const EmergencyRequestsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donorName, setDonorName] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await emergencyService.list({ page, limit: 8, search, status, priority });
      setRows(data.items || []);
      setPagination(data.pagination || { page: 1, totalPages: 1 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch emergency requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, status, priority]);

  const createRequest = async (event) => {
    event.preventDefault();
    if (!form.patientName.trim() || !form.hospital.trim()) {
      setFormError("Patient name and hospital are required");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      await emergencyService.create({
        patientName: form.patientName.trim(),
        bloodGroup: form.bloodGroup,
        hospital: form.hospital.trim(),
        priority: form.priority,
        notes: form.notes.trim(),
      });
      toast.success("Emergency request created");
      setForm(initialForm);
      fetchData();
    } catch (error) {
      setFormError(error?.response?.data?.message || "Unable to create request");
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (actionFn, successMessage) => {
    if (!selectedRequest) return;
    try {
      setSaving(true);
      await actionFn();
      toast.success(successMessage);
      setSelectedRequest(null);
      setDonorName("");
      setRejectNotes("");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Emergency Request Management</h2>
        <p className="mt-1 text-sm text-slate-600">Create, triage, assign, and resolve emergency blood requests in one flow.</p>

        <form className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" onSubmit={createRequest}>
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Patient name" value={form.patientName} onChange={(e) => setForm((prev) => ({ ...prev, patientName: e.target.value }))} />
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.bloodGroup} onChange={(e) => setForm((prev) => ({ ...prev, bloodGroup: e.target.value }))}>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((group) => <option key={group} value={group}>{group}</option>)}
          </select>
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Hospital" value={form.hospital} onChange={(e) => setForm((prev) => ({ ...prev, hospital: e.target.value }))} />
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}>
            {['LOW','MEDIUM','HIGH','CRITICAL'].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <button type="submit" disabled={saving} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-70">Create Request</button>
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2 lg:col-span-5" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
        </form>
        {formError && <p className="mt-2 text-sm text-rose-600">{formError}</p>}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-4">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search patient/hospital/donor"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <select value={priority} onChange={(e) => { setPage(1); setPriority(e.target.value); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatus("");
              setPriority("");
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            Reset Filters
          </button>
        </div>
      </section>

      <EmergencyTable rows={rows} loading={loading} onView={setSelectedRequest} />
      <Pagination page={pagination.page || 1} totalPages={pagination.totalPages || 1} onPageChange={setPage} />

      {selectedRequest && (
        <EmergencyRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={() => runAction(() => emergencyService.approve(selectedRequest._id), "Request approved")}
          onReject={() => runAction(() => emergencyService.reject(selectedRequest._id, rejectNotes), "Request rejected")}
          onAssign={() => runAction(() => emergencyService.assignDonor(selectedRequest._id, donorName), "Donor assigned")}
          onResolve={() => runAction(() => emergencyService.resolve(selectedRequest._id), "Request resolved")}
          loading={saving}
          donorName={donorName}
          setDonorName={setDonorName}
          rejectNotes={rejectNotes}
          setRejectNotes={setRejectNotes}
        />
      )}
    </div>
  );
};

export default EmergencyRequestsPage;
