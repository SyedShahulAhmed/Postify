import React from "react";
import { Link } from "react-router-dom"; // Fixed import
import hero from "../assets/homepage/hero.png";
import { FaPlusSquare } from "react-icons/fa";

const HomepPage = () => {
  return (
    <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 p-6 text-slate-100">
      {/* Left Section - Text */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Express Your Thoughts with{" "}
          <span className="text-orange-600">Postify!</span>
        </h1>
        <h2 className="text-lg md:text-2xl font-medium text-gray-400 mt-4">
          Write, edit, and share your ideas with the world
        </h2>
      </div>

      {/* Right Section - Image */}
      <div className="flex justify-center">
        <img src={hero} alt="Hero" className="w-[400px] h-[400px] object-contain" />
      </div>

      {/* Create Post Section */}
      <div className="flex flex-col items-start w-full text-center">
        <h1 className="text-xl md:text-2xl font-bold text-white mb-4">
          Create Your First Post ✍️
        </h1>
        <Link to="/login">
          <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-300">
            <FaPlusSquare size={20} />
            <span className="font-semibold">Create</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomepPage;
