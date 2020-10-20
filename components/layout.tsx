import React from "react";
import NavBar from "./NavBar";

const Layout: React.FC<React.ReactNode> = ({ children }) => {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
