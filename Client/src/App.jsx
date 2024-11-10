import React from "react";

import { GlobalProvider } from "./Providers/GlobalProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from "./components/routes/AppRoutes";

const App = () => {
  return (
    <>
      <GlobalProvider>
        <ToastContainer />
        <AppRoutes />
      </GlobalProvider>
    </>
  );
};

export default App;
