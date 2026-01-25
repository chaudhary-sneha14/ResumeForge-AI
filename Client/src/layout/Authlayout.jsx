import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-gray-200">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
