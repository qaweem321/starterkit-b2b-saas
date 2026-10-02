const stats = [
  { label: "Members", value: "4" },
  { label: "Plan", value: "Free" },
  { label: "Projects", value: "12" },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-gray-600">Welcome back. Here is what is happening in Acme Inc.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
