import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/api/Hr_api.js";
import { useDispatch, useSelector } from "react-redux";
import { userNotExist } from "../redux/reducer/userReducer.js";
import toast from "react-hot-toast";

const Navbar = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // This will ensure any change in user state will trigger a re-render.
  }, [user]);

  const handleLogout = async () => {
    try {
      const res = await logout({});
      if ("data" in res) {
        toast.success(res.data.message);
        dispatch(userNotExist());

        navigate("/login");
        window.location.reload();
      } else {
        const error = res.error;
        const message = error?.data?.message || "An unknown error occurred.";
        toast.error(message);
      }
    } catch (error) {
      toast.error("Signout Failed");
    }
  };
  console.log(user.isLoggedIn)

  return (
    
    
    <nav className="bg-blue-400 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/onelab.png" alt="MyApp Logo" className="h-8 w-auto" />
        </Link>

        {/* Navigation Links */}
        <div className="ml-auto flex items-center space-x-6">
          {user.isLoggedIn ? (
            <>
              {user.user.role === "Employee" && (
                <>
                 <Link
                    to="/employees"
                    className="text-white hover:text-blue-200"
                  >
                    Employees
                  </Link>
                  <Link
                    to="/my-profile"
                    className="text-white hover:text-blue-200"
                  >
                    My Profile
                  </Link>
                  <button
                    className="text-white hover:text-blue-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}

              {user.user.role === "Super-Admin" && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-blue-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/employees"
                    className="text-white hover:text-blue-200"
                  >
                    Employees
                  </Link>
                  <Link
                    to="/create-employee"
                    className="text-white hover:text-blue-200"
                  >
                    Add Employee
                  </Link>
                  <Link
                    to="/create-hr"
                    className="text-white hover:text-blue-200"
                  >
                    Create New HR
                  </Link>
                  <Link
                    to="/all-hr"
                    className="text-white hover:text-blue-200"
                  >
                    HR's
                  </Link>
                  <button
                    className="text-white hover:text-blue-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}

              {user.user.role === "HR-Admin" && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-blue-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/create-employee"
                    className="text-white hover:text-blue-200"
                  >
                    Add Employee
                  </Link>
                  <Link
                    to="/create-hr"
                    className="text-white hover:text-blue-200"
                  >
                    Create New HR
                  </Link>
                  <button
                    className="text-white hover:text-blue-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-200">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
