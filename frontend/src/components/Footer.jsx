import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white p-4 text-center mt-auto shadow-inner">
      <div className="container mx-auto">
        <p>&copy; {currentYear} MERN Shop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
