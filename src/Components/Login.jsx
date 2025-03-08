import React, { useState } from "react";
import { login } from "../store/authSlice";
import { Button, Input } from "./index";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import loginimg from "../assets/AuthImagees/login.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);

  const handleLogin = async (data) => {
    setError("");
    try {
      const session = await authService.logIn(data);


      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login(userData));
          toast.success("Login successful! 🎉", { autoClose: 2000 });
          setTimeout(() => navigate("/"), 2000); 
        }
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Invalid credentials. Please try again.", { autoClose: 3000 });
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4">
      <ToastContainer /> {/* Toast container for notifications */}
      <div className="mx-auto w-full max-w-sm bg-gray-50 rounded-xl p-6 border border-black/10 shadow-md">
        <div className="mb-2 flex justify-center">
          <img src={loginimg} alt="Login Icon" className="h-16 w-16 mb-2" />
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight text-gray-900">
          👋 Welcome back!
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-orange-600 transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        <form onSubmit={handleSubmit(handleLogin)} className="mt-6">
          <div className="space-y-5">
            <Input
              label="Email :"
              placeholder="Enter your Email"
              type="email"
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid format",
                },
              })}
            />
            <Input
              label="Password :"
              placeholder="Enter your password"
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <Button type="submit" className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500 transition">
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
