import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import NavBar from "../components/Navbar/Navbar";
import {useSelector} from "react-redux";

const PrivateRoute = () => {
  // const { user } = useContext(AuthContext);
  // const token = useSelector(selectCurrentToken);
  //   const token = false;
  const {user} = useSelector(state => state.auth);
  const location = useLocation();
  return user ? (
    <div className="body-container">
      <NavBar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" state={{from: location}} replace />
  );
};

export default PrivateRoute;
