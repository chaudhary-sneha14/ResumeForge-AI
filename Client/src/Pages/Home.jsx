
import { Link } from "react-router-dom";
import Navbar from "../Component/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      <section className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-2xl px-6">
          <h2 className="text-4xl font-bold text-gray-900">
            Build job-ready resumes with AI
          </h2>

          <p className="text-gray-600 mt-4">
            Analyze your resume, improve ATS score, generate cover letters,
            and prepare for interviews — all in one place.
          </p>

          <Link
            to="/dashboard"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
