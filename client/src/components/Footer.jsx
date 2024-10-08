import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-bold">Mr.Automotive</h2>
          <p>© 2020 Mr.Automotive ltd. All rights reserved</p>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
          <div>
            <h3 className="font-bold">Company</h3>
            <ul className="space-y-2">
              {["About us", "Contact us", "Pricing", "Testimonials"].map(
                (item) => (
                  <li key={item} className="hover:text-yellow-400">
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-bold">Support</h3>
            <ul className="space-y-2">
              {[
                "Help center",
                "Terms of service",
                "Legal",
                "Privacy policy",
                "Status",
              ].map((item) => (
                <li key={item} className="hover:text-yellow-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold">Stay up to date</h3>
            <input
              type="email"
              placeholder="Your email address"
              className="mt-2 px-3 py-1 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
