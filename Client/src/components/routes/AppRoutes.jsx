import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../Auth/LoginPage";
import ForgotPassword from "../Auth/ForgotPassword";
import Error from "../Error/Error";
import SignUp from "../Auth/SignUp";
import Home from "../../pages/Home";
import Projects from "../../pages/Projects";
import Builder from "../../pages/Builder";
import AuthRoute from "./AuthRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/" element={<AuthRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/register" element={<SignUp />} />
      </Route>

      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/projects" element={<Projects />} />
        <Route path="/builder" element={<Builder />} />
      </Route>
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default AppRoutes;
