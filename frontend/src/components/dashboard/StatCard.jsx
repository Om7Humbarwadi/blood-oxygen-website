const toneStyles = {
  rose: {
    badge: "bg-rose-100 text-rose-700",
    value: "text-rose-600",
  },
  red: {
    badge: "bg-red-100 text-red-700",
    value: "text-red-600",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700",
    value: "text-amber-600",
  },
};

const StatCard = ({ label, value, change, tone = "rose" }) => {
  const palette = toneStyles[tone] || toneStyles.rose;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${palette.badge}`}>{change}</span>
      </div>
      <p className={`mt-4 text-3xl font-bold tracking-tight ${palette.value}`}>{value}</p>
    </article>
  );
};

export default StatCard;
