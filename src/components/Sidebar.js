import React from "react";
import Logo from "../assets/img/AIO_overlay.png";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar w-1/4 bg-[#60b6f0] flex flex-col">
      <div className="h-16 p-[12px_18px] flex flex-row gap-2 justify-between border-b border-[#FFFFFF33]">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="max-h-8" />
        </div>
      </div>
      <div className="mt-5 flex flex-col">
        <Link
          to="/"
          className="m-[5px_15px] p-[10px_15px] opacity-85 uppercase leading-[30px] rounded-[4px] text-[#FFF] text-[28px] flex cursor-pointer font-semibold hover:opacity-100 hover:bg-[#FFFFFF21]"
        >
          <li className="w-[30px] mr-[15px] text-center align-middle nc-icon nc-atom" />
          <p className="text-[12px] leading-[30px] font-['Roboto']">
            Dashboard
          </p>
        </Link>
        <Link
          to="/train"
          className="m-[5px_15px] p-[10px_15px] opacity-85 uppercase leading-[30px] rounded-[4px] text-[#FFF] text-[28px] flex cursor-pointer font-semibold hover:opacity-100 hover:bg-[#FFFFFF21]"
        >
          <li className="w-[30px] mr-[15px] text-center align-middle nc-icon nc-chart-pie-35" />
          <p className="text-[12px] leading-[30px] font-['Roboto']">Train</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
