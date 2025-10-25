import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // if user is not logged in, redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // otherwise, render the protected content
  return children;
};

export default ProtectedRoute;
