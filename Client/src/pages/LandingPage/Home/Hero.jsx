import React from "react";
import "./Hero.scss";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/projects");
  };

  return (
    <div>
      <div className="hero__unique relative h-screen bg-cover bg-center">
        <div className="hero-overlay__unique absolute inset-0 bg-white opacity-10"></div>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className=" z-50 text-xl">
            <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div class="text-center">
                <p class="max-w-4xl mx-auto mb-4 text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight">
                  From Vision to Website, Without a Single Line of Code
                </p>
                <h1 class="max-w-2xl mx-auto px-6 text-lg text-gray-600 font-inter">
                  Design and launch professional websites effortlessly. Our
                  no-code builder empowers you to create, customize, and
                  publish—no coding required
                </h1>
                <div class="px-8 sm:items-start sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9">
                  <button
                    onClick={handleClick}
                    class="mb-3 sm:mb-0 inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent sm:w-auto rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    role="button"
                  >
                    Go To Project
                  </button>
                  <a
                    onClick={() => {
                      navigate("/register");
                    }}
                    class="inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-gray-900 hover:text-white transition-all duration-200 bg-gray-100 border-2 border-gray-900 sm:w-auto rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    role="button"
                  >
                    Register
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
