import { Navigate } from "react-router-dom";

import { Outlet } from "react-router-dom";

const AuthRoute = () => {
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken;

  return accessToken === undefined ? (
    <div className="w-full h-full">
      <div>
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default AuthRoute;
