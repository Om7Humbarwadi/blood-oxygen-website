import { useState } from "react";
import toast from "react-hot-toast";
import { useRealtime } from "../../context/RealtimeContext";
import { emergencyService } from "../../services/emergencyService";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const { notifications, clearNotifications, removeNotification } = useRealtime();

  const handleApprove = async (notification) => {
    try {
      setApproving(true);
      const requestId = notification.payload._id;
      await emergencyService.approve(requestId);
      removeNotification(notification.id);
      toast.success("Request approved successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve request");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (notification) => {
    try {
      setApproving(true);
      const requestId = notification.payload._id;
      await emergencyService.reject(requestId, "");
      removeNotification(notification.id);
      toast.success("Request rejected");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reject request");
    } finally {
      setApproving(false);
    }
  };
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Notifications
        {notifications.length > 0 && (
          <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-xs text-white">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Live Notifications</p>
            <button type="button" onClick={clearNotifications} className="text-xs text-rose-600 hover:underline">Clear</button>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="rounded-lg bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">No notifications yet</p>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-2.5">
                  <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
