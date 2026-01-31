import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="w-full min-h-screen bg-gray-50 p-6 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
