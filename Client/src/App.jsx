import React from "react";
import { GlobalContext, GlobalProvider } from "./Providers/GlobalProvider";
import { ToastContainer } from "react-toastify";
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
