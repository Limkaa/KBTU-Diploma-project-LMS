import { Outlet, Navigate, useLocation } from "react-router-dom";
import NavBar from "../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/auth/authSlice";

const PrivateRoute = ({ allowedRoles }) => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  if (user !== null) {
    return allowedRoles?.includes(user?.role) ? (
      <div className="body-container">
        <NavBar />
        <Outlet />
      </div>
    ) : (
      <Navigate to="/" state={{ from: location }} replace />
    );
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default PrivateRoute;
