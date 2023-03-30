import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import NavBar from "../components/Navbar/Navbar";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, role } = useContext(AuthContext);
  console.log(allowedRoles, role);
  return user && allowedRoles?.includes(user?.role) ? (
    <div className="body-container">
      <NavBar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
