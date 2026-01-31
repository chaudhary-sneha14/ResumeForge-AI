import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, loading } = useContext(AppContext);

  return (
    <nav className="w-full bg-white border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">ResumeForge AI</h1>

        <div className="flex items-center gap-4">
          {!loading && !userData && (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hidden md:block"
            >
              Create account
            </button>
          )}

          {!loading && userData && (
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-700">
                {userData.name}
              </span>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold" onClick={()=>navigate('/dashboard')}>
                {userData.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
