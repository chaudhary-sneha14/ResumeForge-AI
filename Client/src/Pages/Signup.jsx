import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    const user = {
      name: form.name,
      email: form.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        form.name
      )}&background=2563eb&color=fff`
    };

    localStorage.setItem("user", JSON.stringify(user));

    navigate("/dashboard");
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-900">
        Create an account
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Start building job-ready resumes with AI
      </p>

      <form onSubmit={handleSignup} className="mt-6 space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium"
        >
          Sign up
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 font-medium">
          Login
        </Link>
      </p>
    </>
  );
};

export default Signup;
