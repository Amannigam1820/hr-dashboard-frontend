import Navbar from "./components/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";

import Login from "./pages/LoginPage.jsx";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom"; // Import the ProtectedRoute component
import CreateHrPage from "./pages/CreateHrPage.jsx";
import { useEffect, useState } from "react";
import { useUserInfoQuery, useAllEmployeeQuery } from "./redux/api/Hr_api.js";
import { userExists } from "./redux/reducer/userReducer.js";
import { useDispatch, useSelector } from "react-redux";
import EmployeeList from "./pages/EmployeePage.jsx";
import CreateEmployeePage from "./pages/CreateEmployeePage.jsx";
import EmployeeDetailPage from "./pages/EmployeeDetail.jsx";
import HrList from "./pages/HrList.jsx";
import HrDetail from "./pages/HrDetail.jsx";
import EmployeeDistributionChart from "./pages/EmployeeGenderLocationDeptStats.jsx";
import ViewResume from "./pages/ViewResume.jsx";
import RegisterPage from "./pages/Regiter.jsx";
import MyProfile from "./pages/MyProfile.jsx";

// const user = {
//   id: 1,
//   role: "super-admin", // Change this to "hr-admin" to test different roles
//   isLoggedIn: true, // Simulating login status
// };

function App() {
  const { data, error, isLoading } = useUserInfoQuery();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  // console.log(user);
  // const { data:employeedate , error:errors, isLoading:loaddings } = useAllEmployeeQuery();
  // console.log(employeedate);

  // Handle the fetched data
  useEffect(() => {
    if (isLoading) {
      //console.log("Fetching user data...");
    }

    if (error) {
      console.error("Error fetching user data:", error);
    }

    if (data) {
     // console.log("User Data:", data);
      dispatch(userExists(data));

      // Dispatch or use the data as needed
    }
  }, [data, error, isLoading, dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Use ProtectedRoute for home or other protected pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/create-employee" element={<CreateEmployeePage />} />
        <Route path="/employee-detail/:id" element={<EmployeeDetailPage/>} />
        <Route path="/all-hr" element={<HrList/>} />
        <Route path="/hr-detail/:id" element={<HrDetail/>}/>
        <Route path="/dashboard" element={<EmployeeDistributionChart/>}/>
        <Route path="/resume/:id" element={<ViewResume/>}/>

        <Route
          path="/create-hr"
          element={
            <CreateHrPage />
            // <ProtectedRoute
            //   isLoggedIn={user}
            //   element={<CreateHrPage />}
            // />
          }
        />
        <Route
          path="/employees"
          element={
            <EmployeeList />
            // <ProtectedRoute
            //   isLoggedIn={user}
            //   element={<CreateHrPage />}
            // />
          }
        />
        {/* Register and Login should not be accessible if user is logged in */}
        <Route
          path="/register"
          element={<RegisterPage/>}
        />
        <Route
          path="/login"
          element={<Login />}
          // element={user ? <Navigate to="/" /> : <Login />}
        />

<Route
          path="/my-profile"
          element={<MyProfile />}
          // element={user ? <Navigate to="/" /> : <Login />}
        />


      </Routes>
      <Toaster position="bottom-center" />
    </Router>
  );
}

export default App;

