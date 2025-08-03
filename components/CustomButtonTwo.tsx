import React from "react";

interface CustomButtonTwoProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const CustomButtonTwo: React.FC<CustomButtonTwoProps> = ({
  text,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-white bg-blue-500 focus:outline-none hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${className}`}
    >
      {text}
    </button>
  );
};

export default CustomButtonTwo;
