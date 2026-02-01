export default function StatsGrid({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow p-5"
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-2xl font-semibold mt-2">{item.value}</p>
          <p className="text-sm text-gray-400 mt-1">{item.note}</p>
        </div>
      ))}
    </div>
  );
}
