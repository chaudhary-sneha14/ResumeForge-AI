// src/components/analysis/Suggestions.jsx

export default function Suggestion({ suggestions = [] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Actionable Suggestions
      </h3>

      <ul className="space-y-3 text-sm text-gray-700">
        {suggestions.length === 0 ? (
          <p className="text-sm text-gray-500">
            No suggestions available
          </p>
        ) : (
          suggestions.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-blue-600 font-medium">
                {index + 1}.
              </span>
              <span>{item}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
