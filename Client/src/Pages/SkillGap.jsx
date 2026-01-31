import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";

export default function SkillGap() {
  const {
    backendUrl,
    token,
    jobDescription,
    selectedResumeId,
  } = useContext(AppContext);

  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [cooldown, setCooldown] = useState(false);

  // ---------- Load cache ----------
  useEffect(() => {
    if (!selectedResumeId) return;

    const cached = localStorage.getItem(
      `skill_gap_${selectedResumeId}`
    );

    if (cached) {
      const parsed = JSON.parse(cached);
      setMatchedSkills(parsed.matchedSkills || []);
      setMissingSkills(parsed.missingSkills || []);
    } else {
      setMatchedSkills([]);
      setMissingSkills([]);
    }

    setError("");
    setSuccessMsg("");
  }, [selectedResumeId]);

  // ---------- Generate skill gap ----------
  const fetchSkillGap = async () => {
    if (!selectedResumeId || !jobDescription?.trim()) {
      setError("Resume and job description are required");
      return;
    }

    if (loading || cooldown) return;

    // clear previous state
    setError("");
    setSuccessMsg("");
    setMatchedSkills([]);
    setMissingSkills([]);

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/ai/skill-gap`,
        {
          resumeId: selectedResumeId,
          jobDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.success) {
        const matched = Array.isArray(data.data?.matchedSkills)
          ? data.data.matchedSkills
          : [];

        const missing = Array.isArray(data.data?.missingSkills)
          ? data.data.missingSkills
          : [];

        setMatchedSkills(matched);
        setMissingSkills(missing);

        localStorage.setItem(
          `skill_gap_${selectedResumeId}`,
          JSON.stringify({
            matchedSkills: matched,
            missingSkills: missing,
          })
        );

        setCooldown(true);
        setTimeout(() => setCooldown(false), 8000);
      } else {
        setError("Skill gap analysis failed.");
      }

    } catch (err) {
      setMatchedSkills([]);
      setMissingSkills([]);

      if (err.response?.status === 429) {
        setError("Too many requests. Please wait.");
      } else {
        setError("Failed to analyze skill gap");
      }

    } finally {
      setLoading(false);
    }
  };

  // ---------- Save skill plan ----------
  const saveSkillPlan = async () => {
    if (missingSkills.length === 0 || saving) return;

    try {
      setSaving(true);
      setSuccessMsg("");

      const res = await axios.post(
        `${backendUrl}/api/skill-gap/save`,
        {
          missingSkills,
          jobTitle: "Backend Developer",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setSuccessMsg("Skill plan saved successfully");
      }

    } catch {
      alert("Failed to save skill plan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Skill Gap Planner
        </h1>
        <p className="text-gray-500">
          Identify missing skills and plan your learning path
        </p>
      </div>

      <button
        onClick={fetchSkillGap}
        disabled={loading || cooldown}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-60"
      >
        {loading
          ? "Analyzing..."
          : cooldown
          ? "Please wait..."
          : "Generate Skill Gap"}
      </button>

      {loading && (
        <p className="text-gray-500">Analyzing skills...</p>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-medium mb-4 text-green-600">
              Current Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No matched skills found
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-medium mb-4 text-red-600">
              Skills to Learn
            </h3>

            <div className="space-y-3">
              {missingSkills.length > 0 ? (
                missingSkills.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <p className="font-medium text-sm">
                      {item.skill} ({item.priority})
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No missing skills detected
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {missingSkills.length > 0 && !error && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-medium mb-4">
            Learning Roadmap
          </h3>

          <ul className="space-y-3 text-sm text-gray-700">
            {missingSkills.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-blue-600 font-medium">
                  {index + 1}.
                </span>
                <span>{item.learningPath}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <button
              onClick={saveSkillPlan}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Skill Plan"}
            </button>

            {successMsg && (
              <p className="text-green-600 text-sm mt-2">
                {successMsg}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
