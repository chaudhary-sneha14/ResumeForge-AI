// src/components/analysis/Suggestions.jsx

export default function Suggestion() {
  const suggestions = [
    "Add measurable impact to your projects (numbers, scale, results).",
    "Tailor your resume keywords to the specific job description.",
    "Reduce generic skills and focus on role-relevant technologies.",
    "Strengthen your resume summary with a clear professional pitch.",
    "Add system design or architecture exposure if targeting senior roles."
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Actionable Suggestions
      </h3>

      <ul className="space-y-3 text-sm text-gray-700">
        {suggestions.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span className="text-blue-600 font-medium">
              {index + 1}.
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
