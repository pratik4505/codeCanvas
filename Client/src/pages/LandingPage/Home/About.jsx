import React from "react";
import "./About.scss";

const About = () => {
  return (
    <div id="AboutUs" class="responsive-container-block bigContainer">
      <div class="responsive-container-block Container">
        <p class="text-blk heading">About Us</p>
        <p class="text-blk subHeading">
        CodeCanvas was founded with a vision: to eliminate the barriers to web design. We saw the potential for a platform that combines the power of real-time collaboration, seamless version control, and AI-driven content creation—all in an intuitive, no-code editor. Today, we’re helping creators worldwide design, launch, and scale their online presence without a single line of code.        </p>
        <div class="social-icons-container">
          <a class="social-icon">
            <img
              class="socialIcon image-block"
              src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/bb33.png"
            />
          </a>
          <a class="social-icon">
            <img
              class="socialIcon image-block"
              src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/bb34.png"
            />
          </a>
          <a class="social-icon">
            <img
              class="socialIcon image-block"
              src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/bb35.png"
            />
          </a>
          <a class="social-icon">
            <img
              class="socialIcon image-block"
              src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/bb36.png"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
