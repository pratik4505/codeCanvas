import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../Auth/LoginPage";
import ForgotPassword from "../Auth/ForgotPassword";
import Error from "../Error/Error";
import SignUp from "../Auth/SignUp";
import Home from "../../pages/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="*" element={<Error />} />

      <Route path="/register" element={<SignUp />} />

      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;