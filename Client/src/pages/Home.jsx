import React from "react";
import Header from "./LandingPage/Header";
import Feature from "./LandingPage/Feature";
import About from "./LandingPage/About";
import Presentation from "./LandingPage/Presentation";
import Contact from "./LandingPage/contact";
import aboutimage from "../images/about.png";
import aboutimage1 from "../images/download.png";

const Home = () => {
  return (
    <>
      <Header />
      <Feature />
      <About image={aboutimage} title="All you need is me " />
      <Presentation />
      <About image={aboutimage1} title="All you need is me " />
      <Contact />
    </>
  );
};

export default Home;
