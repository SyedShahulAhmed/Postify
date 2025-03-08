import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../appwrite/auth";
import { logout } from "../store/authSlice";
import Container from "./container/Container";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Header/logo.png";
import {
  RiMenu3Fill,
  RiCloseCircleFill,
  RiHomeFill,
  RiArticleFill,
  RiEdit2Fill,
  RiUserFill,
  RiLoginCircleFill,
  RiLogoutCircleFill,
  RiAddBoxFill,
} from "react-icons/ri";

const Header = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", icon: <RiHomeFill />, active: true },
    { name: "Sign In", slug: "/login", icon: <RiLoginCircleFill />, active: !authStatus },
    { name: "Register", slug: "/signup", icon: <RiUserFill />, active: !authStatus },
    { name: "Explore Posts", slug: "/all-posts", icon: <RiArticleFill />, active: authStatus },
    { name: "My Articles", slug: "/my-posts", icon: <RiEdit2Fill />, active: authStatus },
    { name: "Create Post", slug: "/add-post", icon: <RiAddBoxFill />, active: authStatus },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate("/");
      setShowLogoutConfirm(false);
      setIsMenuOpen(false);
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <header className="bg-[#002945] text-[#edf2fb] shadow-md relative shadow-slate-900">
      <Container>
        <nav className="flex justify-between items-center py-4 px-6">
          <Link
            to="/"
            className="flex items-center space-x-1 text-2xl font-bold text-orange-400 hover:text-orange-500 transition duration-300"
          >
            <img src={logo} alt="Postify Logo" className="w-10 h-10" />
            <span className="text-3xl font-extrabold tracking-wide">ostify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <ul className="flex space-x-6">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name} className="flex items-center space-x-1">
                      <button
                        onClick={() => navigate(item.slug)}
                        className="text-lg flex items-center space-x-1 hover:text-orange-600 transition font-semibold"
                      >
                        {item.icon} <span>{item.name}</span>
                      </button>
                    </li>
                  )
              )}
            </ul>

            {/* Logout Button */}
            {authStatus && (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center space-x-1 bg-blue-500 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition relative z-20"
              >
                <RiLogoutCircleFill size={20} />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-orange-400 text-2xl"
          >
            {isMenuOpen ? "" : <RiMenu3Fill size={30} />}
          </button>
        </nav>
      </Container>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-3/4 h-full bg-gray-900 shadow-md z-50 p-6 flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="self-end text-orange-500 text-2xl"
            >
              <RiCloseCircleFill size={50} />
            </button>

            {/* Mobile Nav Items */}
            <ul className="mt-6 space-y-6">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          navigate(item.slug);
                          setIsMenuOpen(false);
                        }}
                        className="text-lg font-medium flex items-center space-x-2 text-white hover:text-orange-500 transition"
                      >
                        {item.icon} <span>{item.name}</span>
                      </button>
                    </li>
                  )
              )}

              {/* Logout Button */}
              {authStatus && (
                <button
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-600 flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-700 transition w-full relative z-20"
                >
                  <RiLogoutCircleFill size={20} />
                  <span>Logout</span>
                </button>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-xl text-center w-80 relative z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
              <p className="text-gray-600 mt-2">Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
                >
                  <RiLogoutCircleFill size={20} />
                  <span>Yes</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="bg-gray-400 px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
