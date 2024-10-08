import React from "react";
import { FaCertificate, FaUsersCog, FaTools } from "react-icons/fa"; // Import React Icons

const Services = () => {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="d-flex py-5 px-4">
              <FaCertificate className="fa-3x text-DarkColor flex-shrink-0" />
              <div className="ps-4">
                <h5 className="mb-3 font-extrabold text-2xl text-ExtraDarkColor">
                  Quality Servicing
                </h5>
                <p>Diam dolor diam ipsum sit amet diam et eos erat ipsum</p>
                <a className="text-secondary border-bottom" href="#">
                  Read More
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
            <div className="d-flex bg-light py-5 px-4">
              <FaUsersCog className="fa-3x text-DarkColor flex-shrink-0" />
              <div className="ps-4">
                <h5 className="mb-3 font-extrabold text-2xl text-ExtraDarkColor">
                  Expert Workers
                </h5>
                <p>Diam dolor diam ipsum sit amet diam et eos erat ipsum</p>
                <a className="text-secondary border-bottom" href="#">
                  Read More
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
            <div className="d-flex py-5 px-4">
              <FaTools className="fa-3x text-DarkColor flex-shrink-0" />
              <div className="ps-4">
                <h5 className="mb-3 font-extrabold text-2xl text-ExtraDarkColor">
                  Modern Equipment
                </h5>
                <p>Diam dolor diam ipsum sit amet diam et eos erat ipsum</p>
                <a className="text-secondary border-bottom" href="#">
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
