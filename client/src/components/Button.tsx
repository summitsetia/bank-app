import type { JSX } from "react";

interface ButtonProps {
  content: string;
}

const Button = ({ content }: ButtonProps): JSX.Element => {
  return (
    <button
      className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200 font-semibold tracking-wide"
      type="submit"
    >
      {content}
    </button>
  );
};

export default Button;
