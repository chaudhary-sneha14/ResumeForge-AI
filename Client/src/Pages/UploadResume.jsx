import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Header } from "../Component/Header";
import { Card } from "../Component/Card";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

export const UploadResume = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (resumeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?",
    );
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/resume/delete/${resumeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // remove from UI
      setResumes((prev) => prev.filter((resume) => resume._id !== resumeId));
      toast.success("Resume Deleted succesfully");
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete resume");
    }
  };

  // 🔹 Fetch resumes on page load / refresh

  const fetchResumes = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/ai/my-resumes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error("Failed to fetch resumes", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchResumes();
    }
  }, [token]);

  // 🔹 Upload resume
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await axios.post(
        `${backendUrl}/api/ai/upload-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        // prepend newly uploaded resume
        setResumes((prev) => [data.resume, ...prev]);
      }
      toast.success("Resume Uploaded Succesfully");
    } catch (error) {
      console.error("Upload failed", error.response?.data || error);
      alert("Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Upload Resume" subtitle="Upload and manage your resumes" />

      {/* Upload box */}
      <Card>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:border-blue-400 transition">
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
            disabled={loading}
          />
          <p className="text-gray-700 font-medium">
            {loading ? "Uploading..." : "Click to upload your resume"}
          </p>
          <p className="text-sm text-gray-500 mt-1">PDF only</p>
        </label>
      </Card>
      {loading && (
        <p className="mt-4 text-xl text-gray-500">
          Uploading resume… please wait
        </p>
      )}

      {/* Uploaded resumes list */}
      {resumes.length > 0 && (
        <div className="mt-6 space-y-4">
          {resumes.map((resume) => (
            <Card
              key={resume._id}
              className="flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">{resume.title}</p>
                <p className="text-sm text-gray-500">
                  Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  className="text-sm text-blue-600 font-medium"
                  onClick={() => window.open(resume.fileUrl, "_blank")}
                >
                  View
                </button>

                <button
                  className="text-sm text-red-500 font-medium"
                  onClick={() => handleDelete(resume._id)}
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};
