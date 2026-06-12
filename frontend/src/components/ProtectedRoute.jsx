import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAuth = false }) {
  const token = localStorage.getItem("token");
  if (requireAuth && !token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
