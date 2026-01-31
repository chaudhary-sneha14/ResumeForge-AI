import { useState, useEffect, useContext } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { AppContext } from "../Context/AppContext";

export default function CoverLetter() {
  const {
    backendUrl,
    token,
    jobDescription,
    selectedResumeId,
  } = useContext(AppContext);

  const [jobRole, setJobRole] = useState("");
  const [company, setCompany] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- generate cover letter ----------------
  const handleGenerate = async () => {
    if (!selectedResumeId || !jobRole.trim() || !jobDescription?.trim()) {
      alert("Please select resume and job description from Resume Analysis");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/ai/cover-letter`,
        {
          resumeId: selectedResumeId,
          jobTitle: jobRole,
          company,
          jobDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setCoverLetter(data.coverLetter);
      }
    } catch (error) {
      console.error("Cover letter generation failed", error);
      alert("Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- download PDF ----------------
  const handleDownloadPDF = () => {
    if (!coverLetter) return;

    const doc = new jsPDF();
    doc.setFont("Times", "Normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(coverLetter, 180);
    doc.text(lines, 15, 20);

    doc.save(
      company
        ? `Cover_Letter_${company}.pdf`
        : "Cover_Letter.pdf"
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Cover Letter</h1>
        <p className="text-gray-500">
          Generate and edit a tailored cover letter for your job application
        </p>
      </div>

      {/* Warning if context missing */}
      {(!selectedResumeId || !jobDescription) && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded">
          Please select a resume and add job description from the Resume Analysis page first.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input section */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="text-lg font-medium">Details</h3>

          <input
            type="text"
            placeholder="Job Role"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="Company Name (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>
        </div>

        {/* Output section */}
        <div className="bg-white rounded-xl shadow p-6 space-y-3">
          <h3 className="text-lg font-medium">
            Generated Cover Letter
          </h3>

          <p className="text-xs text-gray-500">
            You can edit the cover letter before downloading.
          </p>

          {/* 🔥 Editable editor */}
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Your cover letter will appear here..."
            className="w-full h-72 border rounded-lg p-4 text-sm text-gray-700 resize-none"
          />

          <button
            onClick={handleDownloadPDF}
            disabled={!coverLetter}
            className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-50 disabled:opacity-50"
          >
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
