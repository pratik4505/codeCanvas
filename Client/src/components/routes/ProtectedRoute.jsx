import { Navigate } from "react-router-dom";

import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken;

  return accessToken ? (
    <div className="w-full h-full">
      <div>
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
