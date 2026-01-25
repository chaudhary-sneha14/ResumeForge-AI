import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const menu = [
  { name: "Dashboard", path: "/dashboard", exact: true },
  { name: "Upload Resume", path: "/dashboard/upload" },
  { name: "Resume Analysis", path: "/dashboard/analysis" },
  { name: "Cover Letter", path: "/dashboard/cover-letter" },
  { name: "Skill Gap", path: "/dashboard/skill-gap" },
  { name: "Interview Prep", path: "/dashboard/interview" }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <aside className="w-64 h-screen fixed bg-white border-r border-gray-200 flex flex-col">
      
      {/* Branding */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h1
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          ResumeForge AI
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          AI-powered career toolkit
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 space-y-1">
        {menu.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `block px-6 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Account */}
      {user && (
        <div className="px-6 py-4 border-t border-gray-100 text-sm text-gray-600">
          {user.name}
        </div>
      )}
    </aside>
  );
}
