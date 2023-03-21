import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import NavBar from "../components/Navbar/Navbar";

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  return user ? (
    <div className="body-container">
      <NavBar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
