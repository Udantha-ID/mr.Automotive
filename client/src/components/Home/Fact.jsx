import React from "react";
import { FaCheck, FaUsersCog, FaUsers, FaCar } from "react-icons/fa"; // Import React Icons
import CountUp from "react-countup"; // Import CountUp for counting animations
import { useInView } from "react-intersection-observer"; // Import useInView for visibility detection
import "./../../assets/css/Fact.css"; // Custom CSS file for additional styling

const Fact = () => {
  const { ref, inView } = useInView({ triggerOnce: true }); // Trigger animation only once

  return (
    <div ref={ref} className="container-fluid fact bg-DarkColor my-5 py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6 col-lg-3 text-center">
            <FaCheck className="icon text-white mb-3" />
            <h2 className="text-white mb-2">
              {inView ? <CountUp end={1234} duration={2} /> : "0"}
            </h2>
            <p className="text-white mb-0">Years Experience</p>
          </div>
          <div className="col-md-6 col-lg-3 text-center">
            <FaUsersCog className="icon text-white mb-3" />
            <h2 className="text-white mb-2">
              {inView ? <CountUp end={1234} duration={2} /> : "0"}
            </h2>
            <p className="text-white mb-0">Expert Technicians</p>
          </div>
          <div className="col-md-6 col-lg-3 text-center">
            <FaUsers className="icon text-white mb-3" />
            <h2 className="text-white mb-2">
              {inView ? <CountUp end={1234} duration={2} /> : "0"}
            </h2>
            <p className="text-white mb-0">Satisfied Clients</p>
          </div>
          <div className="col-md-6 col-lg-3 text-center">
            <FaCar className="icon text-white mb-3" />
            <h2 className="text-white mb-2">
              {inView ? <CountUp end={1234} duration={2} /> : "0"}
            </h2>
            <p className="text-white mb-0">Completed Projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fact;
