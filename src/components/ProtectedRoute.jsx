import { Navigate } from "react-router-dom";

// ProtectedRoute will handle checking the login status of the user
const ProtectedRoute = ({ element, isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" />; // Redirect to login if not logged in
  }
  return element; // Allow access to the protected route if logged in
};

export default ProtectedRoute;
