import React from "react";

// import { GlobalContext, GlobalProvider } from "./Providers/GlobalProvider";
// import { ToastContainer } from "react-toastify";
// import AppRoutes from "./components/routes/AppRoutes";
import Feature from "./pages/LandingPage/Feature";
import Header from "./pages/LandingPage/Header";
import About from "./pages/LandingPage/About";
import Presentation from "./pages/LandingPage/Presentation";
import aboutimage from './images/about.png'
import aboutimage1 from './images/download.png'
import Contact from "./pages/LandingPage/contact";
const App = () => {
  return (
    <>
      {/* <GlobalProvider> */}
        {/* <ToastContainer /> */}
        {/* <AppRoutes /> */}
       <Header/>
       <Feature/>
       <About image={aboutimage} title='All you need is me ' />
       <Presentation/>
       <About image={aboutimage1} title='All you need is me ' />
       <Contact/>
      {/* </GlobalProvider> */}
    </>
  );
};

export default App;
