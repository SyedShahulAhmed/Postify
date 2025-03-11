import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Header, Footer } from "./Components";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch(login(user));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-dotted rounded-full animate-spin"></div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      <ToastContainer/>
      <Header />
      <main className="flex-grow p-4 bg-slate-800">
        {error ? (
          <div className="text-center text-red-500 text-lg">{error}</div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
