// src/components/analysis/Strengths.jsx

export default function Strength() {
  const strengths = [
    "Strong project experience in MERN stack",
    "Good use of action verbs in descriptions",
    "Clear education section structure",
    "Relevant technical skills listed"
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Strengths</h3>

      <ul className="space-y-2">
        {strengths.map((item, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-green-500">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
