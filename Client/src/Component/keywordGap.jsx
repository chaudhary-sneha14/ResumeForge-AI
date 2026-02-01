// src/Component/keywordGap.jsx

export default function KeywordGap({ keywords = [] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-red-600">
        Missing Keywords
      </h3>

      <div className="flex flex-wrap gap-2">
        {keywords.length === 0 ? (
          <p className="text-sm text-gray-500">
            No missing keywords 🎉
          </p>
        ) : (
          keywords.map((word, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700"
            >
              {word}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
