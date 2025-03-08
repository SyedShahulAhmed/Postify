import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import { Link } from "react-router-dom";
import { Input, Button } from "./index";
import { login } from "../store/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import signupimg from "../assets/AuthImagees/signup.png";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);

  const create = async (data) => {
    setError("");
    try {
      const accountData = await authService.createAccount(data);
      if (accountData) {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch(login(user));
          toast.success("Account created successfully! 🎉", { autoClose: 2000 });
          setTimeout(() => navigate("/"), 2000); // Delay navigation to show toast
        }
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Failed to create an account. Try again.", { autoClose: 3000 });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ToastContainer /> {/* Toast container for notifications */}
      <div className="mx-auto w-full max-w-lg bg-slate-50 shadow-lg rounded-xl p-10 border border-gray-300">
        <div className="mb-4 flex justify-center">
          <img src={signupimg} alt="Signup Icon" className="h-16 w-16" />
        </div>
        <h2 className="text-center text-xl font-bold text-gray-800">
          Start your journey – create an account!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-orange-600 transition duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        <form onSubmit={handleSubmit(create)} className="mt-6">
          <div className="space-y-5">
            <Input
              label="Full Name :"
              type="text"
              placeholder="Enter your full name"
              {...register("name", { required: "Name is required" })}
            />
            <Input
              label="Email :"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            <Input
              label="Password :"
              type="password"
              placeholder="Enter password"
              {...register("password", { required: "Password is required" })}
            />
            <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
