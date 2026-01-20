import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import api from "../../api";

const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/signup", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      // ✅ After successful signup → go to login page
      navigate("/");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Registration failed");
      } else {
        setError("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="hidden lg:block w-1/2">
        {/* <LeftContent /> */}
        <div className="relative min-h-screen bg-sky-100 flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-14">
          {/* Logo */}
          <img src={Logo} alt="logo" className="w-[110px] sm:w-[130px]" />

          {/* Text Content */}
          <div className="max-w-xl">
            <p
              className="
                  font-light italic text-slate-800
                  text-3xl sm:text-4xl lg:text-5xl
                  leading-snug
                "
            >
              Welcome.
              <br />
              Begin your cinematic
              <br />
              adventure now with
              <br />
              our ticketing
              <br />
              platform!
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2">
        {/* <RegisterRightContent /> */}
        <div className="w-full min-h-screen flex items-center justify-center bg-white px-6">
          {/* Register Card */}
          <div className="w-full max-w-[450px] flex flex-col">
            {/* Heading */}
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center md:text-left">
              Create an account
            </h2>

            {/* Form */}
            <div className="flex flex-col gap-6">
              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-600">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="h-12 px-4 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-600">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="h-12 px-4 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-600">Email</label>
                <input
                  type="email"
                  placeholder="balamia@gmail.com"
                  className="h-12 px-4 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm text-slate-600">Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="h-12 px-4 pr-10 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm text-slate-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="h-12 px-4 pr-10 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Sign Up Button */}
              <button
                onClick={handleRegister}
                disabled={loading}
                className="
            h-12
            border
            border-sky-400
            text-sky-500
            text-lg
            rounded-md
            font-medium
            hover:bg-sky-500
            hover:text-white
            transition
          "
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center mt-6 text-sm text-slate-500">
              Already Have An Account?
              <span
                onClick={() => navigate("/")}
                className="text-sky-500 cursor-pointer ml-1 hover:underline"
              >
                Login
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
