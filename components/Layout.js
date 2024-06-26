import React from "react";
import Sidebar from "./Sidebar";
import Navbar1 from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar1 />
          <main className="p-4 ml-56 font-popin">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
