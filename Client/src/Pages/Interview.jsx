import { useContext, useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { AppContext } from "../Context/AppContext";
import axios from "axios";

export default function Interview() {
  const {
    backendUrl,
    token,
    jobDescription,
    selectedResumeId,
  } = useContext(AppContext);

  const [type, setType] = useState("technical");
  const [openIndex, setOpenIndex] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(false);

  // ---------- Load cache ----------
  useEffect(() => {
    if (!selectedResumeId) return;

    const cached = localStorage.getItem(
      `interview_${selectedResumeId}`
    );

    if (cached) {
      setQuestions(JSON.parse(cached));
    } else {
      setQuestions(null);
    }

    setOpenIndex(null);
    setError("");
  }, [selectedResumeId]);

  // ---------- Generate Questions ----------
  const fetchInterviewQuestions = async () => {
    if (!selectedResumeId || !jobDescription?.trim()) {
      setError("Resume and job description are required");
      return;
    }

    if (loading || cooldown) return;

    const cached = localStorage.getItem(
      `interview_${selectedResumeId}`
    );

    if (cached) {
      setQuestions(JSON.parse(cached));
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${backendUrl}/api/ai/interview/${selectedResumeId}`,
        { jobDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setQuestions(res.data.data);

        localStorage.setItem(
          `interview_${selectedResumeId}`,
          JSON.stringify(res.data.data)
        );

        setOpenIndex(null);

        setCooldown(true);
        setTimeout(() => setCooldown(false), 8000);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Too many requests. Please wait.");
      } else {
        setError("Failed to generate interview questions");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Interview Prep</h1>
        <p className="text-gray-500">
          Practice interview questions with answers
        </p>
      </div>

      <button
        onClick={fetchInterviewQuestions}
        disabled={loading || cooldown}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-60"
      >
        {loading
          ? "Generating..."
          : cooldown
          ? "Please wait..."
          : "Generate Interview Questions"}
      </button>

      <div className="flex gap-3">
        {["technical", "behavioral", "projectBased"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setType(item);
              setOpenIndex(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm capitalize border ${
              type === item
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {questions && questions[type]?.length > 0 ? (
        <div className="space-y-4">
          {questions[type].map((item, index) => {
            const questionText =
              typeof item === "string"
                ? item
                : item.question;

            const answerText =
              typeof item === "object"
                ? item.answer || "Answer not available"
                : null;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-5 cursor-pointer"
                onClick={() => handleToggle(index)}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">
                    {index + 1}. {questionText}
                  </p>

                  <span>
                    {openIndex === index ? (
                      <FiChevronUp size={18} />
                    ) : (
                      <FiChevronDown size={18} />
                    )}
                  </span>
                </div>

                {openIndex === index && answerText && (
                  <p className="mt-3 text-sm text-gray-600">
                    {answerText}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <p className="text-gray-500">
            No questions available for this category.
          </p>
        )
      )}
    </div>
  );
}
