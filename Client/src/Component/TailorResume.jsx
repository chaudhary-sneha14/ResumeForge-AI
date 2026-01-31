import { Card } from "./Card";

export default function TailorResume({ tailored }) {
  if (!tailored) return null;

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">
        Tailored Resume
      </h2>

      {/* Summary */}
      <section className="mb-6">
        <h3 className="font-medium text-lg mb-2">
          Tailored Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {tailored.tailoredSummary}
        </p>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <h3 className="font-medium text-lg mb-2">
          Reordered Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {tailored.reorderedSkills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Missing Keywords */}
      <section className="mb-6">
        <h3 className="font-medium text-lg mb-2">
          Missing Keywords
        </h3>
        <ul className="list-disc ml-5 text-gray-700">
          {tailored.missingKeywords.map((kw, i) => (
            <li key={i}>{kw}</li>
          ))}
        </ul>
      </section>

      {/* Experience */}
      <section>
        <h3 className="font-medium text-lg mb-3">
          Tailored Experience
        </h3>

        <div className="space-y-4">
          {tailored.tailoredExperience.map((exp, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 bg-gray-50"
            >
              <div className="flex justify-between mb-1">
                <h4 className="font-semibold">
                  {exp.position}
                </h4>
                <span className="text-sm text-gray-500">
                  {exp.company}
                </span>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Card>
  );
}
