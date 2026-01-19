import React from 'react'

const RightContent = () => {
  return (
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
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="h-12 px-4 pr-10 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <span className="absolute right-4 top-[38px] text-slate-400 cursor-pointer">
              👁
            </span>
          </div>

          {/* Login Button */}
          <button className="h-12 border border-sky-400 text-sky-500 text-lg rounded-md font-medium hover:bg-sky-500 hover:text-white transition">
            Login
          </button>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-center mt-6 text-sm text-slate-500">
          Don’t Have An Account?
          <span className="text-sky-500 cursor-pointer ml-1">
            Register Here
          </span>
        </div>

      </div>
    </div>
  )
}

export default RightContent