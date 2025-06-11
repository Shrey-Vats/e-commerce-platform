import React from "react";

const Message = ({ variant = "info", children }) => {
  const colorMap = {
    info: "bg-blue-100 text-blue-800 border-blue-200",
    success: "bg-green-100 text-green-800 border-green-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };
  return (
    <div
      className={`border-l-4 p-4 mb-4 rounded ${
        colorMap[variant] || colorMap.info
      }`}
      role="alert"
    >
      {children}
    </div>
  );
};

export default Message;
