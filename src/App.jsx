import Navbar from "./components/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";

import Login from "./pages/LoginPage.jsx";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom"; // Import the ProtectedRoute component
import CreateHrPage from "./pages/CreateHrPage.jsx";
import { useEffect, useState } from "react";
// import axios from "axios";
// // import { useUserInfoQuery } from "./redux/api/Hr_api.js";
// //import Cookies from 'js-cookie';
// import Cookies from "js-cookie";

const user = {
  id: 1,
  role: "super-admin", // Change this to "hr-admin" to test different roles
  isLoggedIn: true, // Simulating login status
};

function App() {
  // const { data , isLoading, isError} = useUserInfoQuery("");
  // console.log(data);
  // const [data, setData] = useState(null);
  // const [error, setError] = useState(null);
  // const token = Cookies.get("token");
  // console.log(token,">>>>>>>>>>>>this i scokkies");
  //const token = Cookies.get("token");
  // function getCookie(name) {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(";").shift();
  // }

  // const token = getCookie("token");
  // console.log("Token from cookie:", token);
  //console.log(token);

  useEffect(() => {
    // Replace with actual token value
    //    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhajIzIiwiZXhwIjoxNzMzMzA3MTczfQ.q6Fpp05IGeAGj0S4uWP1ae3QDVZwfp9IdS1D0Qb3rcw"
    // document.cookie = `token=${token}; path=/;`;
    const fetchData = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      console.log(token, ">>>>>>>>>>>>>>>>>>>>>>>>token");

      try {
        const response = await fetch("http://127.0.0.1:8080/api/hr/me", {
          method: "GET",
          // headers: {
          //   "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
          //   Cookie: `token=${token}`,// Add the token in the Authorization header
          // },
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${token}`, // Explicitly add the cookie
          },

          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User Data:", data);
          //dispatch(userExists(data));
        } else {
          console.error("Error: Unauthorized or no user data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Use ProtectedRoute for home or other protected pages */}
        <Route
          path="/"
          element={
            <ProtectedRoute
              isLoggedIn={user.isLoggedIn}
              element={<HomePage />}
            />
          }
        />
        <Route
          path="/create-hr"
          element={
            <ProtectedRoute
              isLoggedIn={user.isLoggedIn}
              element={<CreateHrPage />}
            />
          }
        />
        {/* Register and Login should not be accessible if user is logged in */}
        {/* <Route
          path="/register"
          element={user.isLoggedIn ? <Navigate to="/" /> : <Register />}
        /> */}
        <Route
          path="/login"
          element={user.isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
      </Routes>
      <Toaster position="bottom-center" />
    </Router>
  );
}

export default App;
