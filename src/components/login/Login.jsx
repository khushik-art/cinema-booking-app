import React, { useState } from "react";
import Register from "./register";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await Axios.post(
        "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      const token = res.data.data.accessToken;
      localStorage.setItem("token", token);
      navigate("/home");

    } catch (error) {
  if (error.response) {
    // Backend responded with error
    console.error(error.response.data);
  } else {
    // Network / server error
    console.error("Network error");
  }
}
  };

  return (
    <>
      <div className="min-h-screen grid grid-cols-2">
        {/* <LeftContent /> 
           {/* Logo */}
        <div className="relative min-h-screen bg-sky-100 flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-14">
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
        {/* <RightContent /> */}
        <div className="w-full min-h-screen flex items-center justify-center bg-white px-6">
          {/* Login Card */}
          <div className="w-full max-w-[450px] flex flex-col">
            {/* Heading */}
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center md:text-left">
              Login to your account
            </h2>

            {/* Form */}
            <div className="flex flex-col gap-6">
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

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Login Button */}
              <button
                className="h-12 border border-sky-400 text-sky-500 text-lg rounded-md font-medium hover:bg-sky-500 hover:text-white transition"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center mt-6 text-sm text-slate-500">
              Don’t Have An Account?
              <span
                onClick={() => navigate("/register")}
                className="text-sky-500 cursor-pointer ml-1 hover:underline"
              >
                Register Here
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
