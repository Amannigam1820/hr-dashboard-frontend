import Navbar from "./components/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import HomePage from "./pages/HomePage.jsx";

import Login from "./pages/LoginPage.jsx";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom"; // Import the ProtectedRoute component
import CreateHrPage from "./pages/CreateHrPage.jsx";

const user = {
  id: 1,
  role: "super-admin", // Change this to "hr-admin" to test different roles
  isLoggedIn: true, // Simulating login status
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Use ProtectedRoute for home or other protected pages */}
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={user.isLoggedIn} element={<HomePage />} />
          }
        />
         <Route
          path="/create-hr"
          element={
            <ProtectedRoute isLoggedIn={user.isLoggedIn} element={<CreateHrPage />} />
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
