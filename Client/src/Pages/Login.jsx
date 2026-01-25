import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("No account found. Please sign up first.");
      return;
    }

    if (storedUser.email !== email) {
      alert("Email does not match");
      return;
    }

    // login success → do NOT overwrite user
    navigate("/dashboard");
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-900">
        Welcome back
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Login to your ResumeForge AI account
      </p>

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm"
          required
        />

        {/* Password UI only for now */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg p-3 text-sm"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6 text-center">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-600 font-medium">
          Sign up
        </Link>
      </p>
    </>
  );
};

export default Login;
