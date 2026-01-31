// src/components/analysis/KeywordGap.jsx

export default function KeywordGap() {
  const matchedKeywords = [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "REST APIs",
    "Git"
  ];

  const missingKeywords = [
    "System Design",
    "Docker",
    "CI/CD",
    "AWS",
    "Microservices"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Matched Keywords */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-600">
          Matched Keywords
        </h3>

        <div className="flex flex-wrap gap-2">
          {matchedKeywords.map((word, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-red-600">
          Missing Keywords
        </h3>

        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((word, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
