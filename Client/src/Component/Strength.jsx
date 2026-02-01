// src/components/analysis/Strength.jsx
export default function Strength({ items = [] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Strengths</h3>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-sm text-gray-700 flex items-start gap-2"
          >
            <span className="text-green-500">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
