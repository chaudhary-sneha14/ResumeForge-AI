import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";

export default function SkillProgress() {
  const { backendUrl, token } = useContext(AppContext);

  // Always array
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------- Utility ----------
  const toArray = (value) => (Array.isArray(value) ? value : []);

  // ---------- Fetch saved skills ----------
  const fetchSkillProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${backendUrl}/api/ai/skill-progress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSkills(toArray(res?.data?.data));
    } catch (err) {
      console.error("Fetch skills failed:", err);
      setError("Failed to load skill progress");
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSkillProgress();
  }, []);

  // ---------- Update skill status ----------
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${backendUrl}/api/ai/skill-gap/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI immediately
      setSkills((prev) =>
        prev.map((skill) =>
          skill._id === id
            ? { ...skill, status }
            : skill
        )
      );
    } catch (err) {
      console.error("Update status failed:", err);
    }
  };

  // ---------- Delete completed skill ----------
  const deleteSkill = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this completed skill?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${backendUrl}/api/ai/skill-gap/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove from UI without refetch
      setSkills((prev) =>
        prev.filter((skill) => skill._id !== id)
      );
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Skill Progress</h1>
        <p className="text-gray-500">
          Track and manage your learning progress
        </p>
      </div>

      {loading && (
        <p className="text-gray-500">Loading skills...</p>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {/* Skill List */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-medium mb-4">
          Your Skill Plan
        </h3>

        {!loading && skills.length === 0 ? (
          <p className="text-sm text-gray-400">
            No skills saved yet. Generate a skill gap first.
          </p>
        ) : (
          <div className="space-y-3">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="border rounded-lg p-3"
              >
                <p className="font-medium text-sm">
                  {skill.skill}
                </p>

                <p className="text-xs text-gray-500">
                  Priority: {skill.priority}
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  {skill.learningPath}
                </p>

                <div className="mt-3 flex items-center gap-4">
                  {/* Status Dropdown */}
                  <select
                    value={skill.status}
                    onChange={(e) =>
                      updateStatus(
                        skill._id,
                        e.target.value
                      )
                    }
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="pending">
                      Pending
                    </option>
                    <option value="in-progress">
                      In Progress
                    </option>
                    <option value="completed">
                      Completed
                    </option>
                  </select>

                  {/* Delete button only if completed */}
                  {skill.status === "completed" && (
                    <button
                      onClick={() =>
                        deleteSkill(skill._id)
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
