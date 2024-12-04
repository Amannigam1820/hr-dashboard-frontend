import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/api/Hr_api.js";
import { useDispatch, useSelector } from "react-redux";
import {userNotExist} from "../redux/reducer/userReducer.js"

import toast from "react-hot-toast";

const Navbar = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector((state)=>state.user)
  //console.log(user.user.role);
  
  
  
  // const user = {
  //   id: 1,
  //   role: "hr-admin", // Change this to "hr-admin" to test different roles
  //   isLoggedIn: true, // Simulating login status
  // };

  const handleLogout = async () => {
    try {
      const res = await logout({});
      //console.log(res);

      if ("data" in res) {
        console.log(res.data.message);


        toast.success(res.data.message);

        console.log("before dispatch call");
        
        dispatch(userNotExist())
        console.log("after dispatch call");
        

        navigate("/login");
      } else {
        const error = res.error;
        const message = error?.data?.message || "An unknown error occurred.";
        toast.error(message);
      }
    } catch (error) {
      toast.error("Signin Failed");
    }
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
              {user.user.role === "Super-Admin" && (
                <Link
                  to="/create-hr"
                  className="text-white hover:text-blue-200"
                >
                  Create New HR
                </Link>
              )}
              <button
                className="text-white hover:text-blue-200"
                onClick={handleLogout}
              >
                Logout
              </button>
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
