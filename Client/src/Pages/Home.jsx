import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Navbar from "../Component/Navbar";
import { AppContext } from "../Context/AppContext";

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Center content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-2xl px-6">
          <h2 className="text-4xl font-bold text-gray-900">
            Build job-ready resumes with AI
          </h2>

          <p className="text-gray-600 mt-4">
            Analyze your resume, create resumes, improve ATS score, generate
            cover letters, and prepare for interviews — all in one place.
          </p>

          <button
            onClick={() =>
              userData ? navigate("/dashboard") : navigate("/login")
            }
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2
  border-t border-gray-200/100 bg-white text-sm text-gray-500
  px-4 py-3"
      >
        <span>© {new Date().getFullYear()} ResumeForge AI</span>

        <span className="hidden sm:inline">·</span>

        <span>
          Built with ❤️ by{" "}
          <span className="font-medium text-gray-700">Sneha</span>
        </span>
      </footer>
    </div>
  );
};

export default Home;
