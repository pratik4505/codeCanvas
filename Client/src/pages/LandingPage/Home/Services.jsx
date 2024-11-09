import React from "react";
import "./Services.scss";

const Services = () => {
  return (
    <div className="">
      <section className="section-services ">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-md-10 col-lg-8">
              <div className="header-section">
                <h2 className="title">Exclusive Services</h2>
                <p className="description">
                Built on the Belief That You Deserve the Best—Exceptional Service, Every Step of the Way.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {/* <!-- Single Service --> */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fab fa-battle-net"></i>
                  </span>
                  <h3 className="title">Real-Time Collaboration</h3>
                  <p className="description">
                  Work together seamlessly. Make instant updates, share feedback, and build as a team without lag—no matter where you are                  <br />
                  
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fab fa-asymmetrik"></i>
                  </span>
                  <h3 className="title">Version Control
                  </h3>
                  <p className="description">
                  Track every change with ease. Restore previous versions anytime, giving you peace of mind and full control over your website.
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fab fa-artstation"></i>
                  </span>
                  <h3 className="title">Live Hosting</h3>
                  <p className="description">
                  Publish your site with one click. Our reliable, secure, and fast hosting ensures your website is always live and accessible.   
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fab fa-500px"></i>
                  </span>
                  <h3 className="title">AI-Powered Content Generation</h3>
                  <p className="description">
                  Create content effortlessly. Let AI generate text, images, and ideas so you can focus on bringing your vision to life faster.
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fas fa-chart-pie"></i>
                  </span>
                  <h3 className="title">Drag-and-Drop Editing</h3>
                  <p className="description">
                  Customize every detail with ease. Build beautiful layouts and add elements instantly with our intuitive, code-free editor.
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fas fa-laptop-code"></i>
                  </span>
                  <h3 className="title">Premade Templates</h3>
                  <p className="description">
                  Jumpstart your site with beautifully designed templates. Easily customize every aspect to match your brand and style.
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
