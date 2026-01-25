import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar";


const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 w-full min-h-screen bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
