import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const menu = [
  { name: "Dashboard", path: "/dashboard", exact: true },
  { name: "Create Resume", path: "/dashboard/create" },
  { name: "Upload Resume", path: "/dashboard/upload" },
  { name: "Resume Analysis", path: "/dashboard/analysis" },
  { name: "Cover Letter", path: "/dashboard/cover-letter" },
  { name: "Skill Gap", path: "/dashboard/skill-gap" },
  { name: "Interview Prep", path: "/dashboard/interview" },
  { name: "Skill Progress", path: "/dashboard/skill-progress" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { setToken, userData, setUserData, loading } = useContext(AppContext);

  const handleLogout = () => {
    localStorage.removeItem("rf_token");
    setToken(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Hamburger button (mobile) */}
      <button
        className="md:hidden fixed top-2 left-2 z-50 p-1 rounded-md bg-white border shadow"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={12} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Mobile close button */}
        <div className="md:hidden flex justify-end px-4 py-3 border-b">
          <button onClick={() => setIsOpen(false)} aria-label="Close sidebar">
            <X size={22} />
          </button>
        </div>

        {/* Branding */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h1
            className="text-xl font-bold text-blue-600 cursor-pointer"
            onClick={() => {
              navigate("/");
              setIsOpen(false);
            }}
          >
            ResumeForge AI
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            AI-powered career toolkit
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              onClick={() => setIsOpen(false)}
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
        {!loading && userData && (
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className=" w-full flex items-center justify-center gap-2 text-sm font-medium
        text-red-600 border border-red-200 rounded-lg py-2 hover:bg-red-50 transition "
            >
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
