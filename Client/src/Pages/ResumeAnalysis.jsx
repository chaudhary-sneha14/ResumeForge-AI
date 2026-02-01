import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";

import KeywordGap from "../Component/keywordGap";
import ScoreCard from "../Component/ScoreCard";
import StatsGrid from "../Component/StartsGrid";
import Strength from "../Component/Strength";
import Suggestion from "../Component/Suggestion";
import Weakness from "../Component/Weakness";
import TailorResume from "../Component/TailorResume";
import { Card } from "../Component/Card";

export default function ResumeAnalysis() {
  const {
    backendUrl,
    token,
    resumes,
    fetchResumes,
    jobDescription,
    setJobDescription,
    selectedResumeId,
    setSelectedResumeId,
  } = useContext(AppContext);

  const [analysis, setAnalysis] = useState(null);
  const [tailored, setTailored] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ ATS score now stored in state
  const [score, setScore] = useState(0);

  // ---------------- fetch resumes ----------------
  useEffect(() => {
    if (token) fetchResumes();
  }, [token]);

  // ---------------- analyze resume ----------------
  const handleAnalyze = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      alert("Please select a resume and add job description");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/ai/keyword-gap/${selectedResumeId}`,
        { jobDescription },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        setAnalysis(data.data);
        setScore(data.atsScore); // ✅ use backend ATS
      }
    } catch (error) {
      console.error("Resume analysis failed", error);
      alert("Resume analysis failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- tailor resume ----------------
  const handleTailorResume = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      alert("Please select a resume and add job description");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/ai/tailor/${selectedResumeId}`,
        { jobDescription },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        setTailored(data.data);
      }
    } catch (error) {
      console.error("Tailor resume failed", error);
      alert("Tailoring failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Resume Analysis</h1>
        <p className="text-gray-500">
          AI-powered insights to improve your resume
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <div className="space-y-4">
          {/* Resume selector */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Resume
            </label>
            <select
              className="w-full border rounded p-2"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
            >
              <option value="">Choose a resume</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.title}
                </option>
              ))}
            </select>
          </div>

          {/* Job description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Job Description
            </label>
            <textarea
              className="w-full border rounded p-2"
              rows={6}
              placeholder="Paste job description here"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Job description is reused across all features.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>

            <button
              onClick={handleTailorResume}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
            >
              Tailor Resume
            </button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {analysis && (
        <>
          <ScoreCard score={score} />

          <StatsGrid
            stats={[
              {
                label: "Missing Keywords",
                value: analysis.missingKeywords.length,
                note: "Skills not found in resume",
              },
              {
                label: "Weak Words",
                value: analysis.weakWords.length,
                note: "Low-impact language",
              },
              {
                label: "ATS Score",
                value: score,
                note: "Overall resume match",
              },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Strength items={analysis.strongAlternatives} />
            <Weakness items={analysis.weakWords} />
          </div>

          <KeywordGap keywords={analysis.missingKeywords} />
          <Suggestion suggestions={analysis.strongAlternatives} />
        </>
      )}

      {/* Tailored Resume */}
      {tailored && <TailorResume tailored={tailored} />}
    </div>
  );
}
