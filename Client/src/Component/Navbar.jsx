import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <h1 className="text-xl font-bold text-blue-600">
          ResumeForge AI
        </h1>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>

              <img
                src={user.avatar}
                alt="profile"
                className="w-8 h-8 rounded-full border"
              />
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
