import React from "react";
import { Link,useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate()
  const user = {
    id: 1,
    role: "super-admin", // Change this to "hr-admin" to test different roles
    isLoggedIn: true, // Simulating login status
  };

  return (
    <nav className="bg-blue-400 shadow-md sticky">
      <div className="container mx-auto px-4 py-3 flex items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/onelab.png" alt="MyApp Logo" className="h-8 w-auto" />
        </div>

        {/* Navigation Links */}
        <div className="ml-auto flex items-center space-x-6">
          {user.isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-blue-200">
                Dashboard
              </Link>
              <Link to="/employees" className="text-white hover:text-blue-200">
                Employees
              </Link>
              {user.role === "super-admin" && (
                <Link to="/create-hr" className="text-white hover:text-blue-200" >
                  Create New HR
                </Link>
              )}
              <button className="text-white hover:text-blue-200">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-200">
                Login
              </Link>
              {/* <Link to="/register" className="text-white hover:text-blue-200">
                Register
              </Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
