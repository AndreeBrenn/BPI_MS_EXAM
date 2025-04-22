import React, { useState } from "react";
import { useAuth } from "../zustand/Auth";
import { CiAt, CiLock } from "react-icons/ci";
import axios from "axios";

const Login = () => {
  const [inputFields, setInputFields] = useState({
    username: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);

  const { loginUser, loginLoading, error, errorMessage } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowError(true); // Show error only after button click
    loginUser(inputFields.username, inputFields.password);
  };

  const errorHandler = () => {
    if (error && showError) {
      if (errorMessage?.response?.status === 404) {
        return "User doesn't exist";
      }
      if (errorMessage?.response?.status === 403) {
        return "Wrong password"; // Changed this message to be more specific
      }
    }
    return "";
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#e0f7fa] to-[#ffffff] flex justify-center items-center">
      {/* Form with #326EA0 Theme */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 h-3/4 flex border border-blue-200">
        {/* Left Side: Form */}
        <div className="w-1/2 pr-8 flex flex-col justify-center items-center">
          {/* Circle with Full-Screen Image */}
          <div className="w-24 h-24 bg-[#326EA0] rounded-full flex justify-center items-center mb-8 overflow-hidden">
            <img
              src="/NoImage.jpg"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-3xl font-bold mb-8 text-black text-center">
            LOGIN
          </h2>

          <form onSubmit={handleLogin} className="space-y-6 w-full">
            <div className="relative">
              <CiAt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
              <input
                type="text"
                onChange={(e) => {
                  setInputFields({ ...inputFields, username: e.target.value });
                  setShowError(false); // Reset error when user types
                }}
                className="w-full p-4 pl-10 border border-[#326EA0] rounded focus:outline-none focus:ring-2 focus:ring-[#326EA0]"
                placeholder="Username"
                value={inputFields.username}
              />
            </div>

            <div className="relative">
              <CiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
              <input
                type="password"
                onChange={(e) => {
                  setInputFields({ ...inputFields, password: e.target.value });
                  setShowError(false); // Reset error when user types
                }}
                className="w-full p-4 pl-10 border border-[#326EA0] rounded focus:outline-none focus:ring-2 focus:ring-[#326EA0]"
                placeholder="Password"
                value={inputFields.password}
              />
            </div>

            {/* Error Message - Only shows after login attempt */}
            {errorHandler() && (
              <div className="text-red-500 text-sm text-center">
                {errorHandler()}
              </div>
            )}

            <div className="flex justify-between items-center">
              <div>
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2 text-[#326EA0]"
                />
                <label htmlFor="remember" className="text-[#326EA0]">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-[#326EA0] text-sm">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#326EA0] text-white p-4 rounded hover:bg-green-500 transition-all duration-300"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Right Side: Expanded and Shifted Image */}
        <div className="w-1/2 flex justify-end items-center h-full pr-4">
          <img
            src="/NoImage.jpg"
            alt="Login Illustration"
            className="h-full w-full object-cover rounded-lg shadow-md transform translate-x-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
