import React from "react";
import Logo from "../../assets/logo.png";

const LeftContent = () => {
  return (
    <div className="relative min-h-screen bg-sky-100 flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-14">

      {/* Logo */}
      <img
        src={Logo}
        alt="logo"
        className="w-[110px] sm:w-[130px]"
      />

      {/* Text Content */}
      <div className="max-w-xl">
        <p className="
          font-light italic text-slate-800
          text-3xl sm:text-4xl lg:text-5xl
          leading-snug
        ">
          Welcome.<br />
          Begin your cinematic<br />
          adventure now with<br />
          our ticketing<br />
          platform!
        </p>
      </div>
    </div>
  );
};

export default LeftContent;
