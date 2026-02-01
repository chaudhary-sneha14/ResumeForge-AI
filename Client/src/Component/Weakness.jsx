// src/components/analysis/Weaknesses.jsx

export default function Weakness({ items = [] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Weaknesses</h3>

      <ul className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">
            No major weaknesses detected
          </p>
        ) : (
          items.map((item, index) => (
            <li
              key={index}
              className="text-sm text-gray-700 flex items-start gap-2"
            >
              <span className="text-red-500">•</span>
              <span>{item}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
