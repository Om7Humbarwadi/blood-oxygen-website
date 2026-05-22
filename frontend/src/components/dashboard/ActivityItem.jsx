const ActivityItem = ({ title, detail, time, priority }) => {
  const priorityStyle =
    priority === "critical"
      ? "bg-rose-100 text-rose-700"
      : priority === "warning"
        ? "bg-amber-100 text-amber-700"
        : "bg-emerald-100 text-emerald-700";

  return (
    <article className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-600">{detail}</p>
      </div>
      <div className="text-right">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyle}`}>{priority}</span>
        <p className="mt-2 text-xs text-slate-500">{time}</p>
      </div>
    </article>
  );
};

export default ActivityItem;
