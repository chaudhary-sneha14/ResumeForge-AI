// src/components/analysis/ScoreCard.jsx

export default function ScoreCard() {
  const score = 78;

  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
      
      <div>
        <h2 className="text-lg font-medium">ATS Score</h2>
        <p className="text-gray-500 text-sm">
          How well your resume matches job descriptions
        </p>
      </div>

      <div className="text-right">
        <p className="text-4xl font-bold text-blue-600">{score}/100</p>
        <p className="text-sm text-gray-500">Good match</p>
      </div>

    </div>
  );
}
