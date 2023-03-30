import { Outlet, Navigate, useLocation } from "react-router-dom";
import NavBar from "../components/Navbar/Navbar";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../redux/auth/authSlice";

const PrivateRoute = () => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  // const user = true;
  return (user !== null) ? (
    <div className="body-container">
      <NavBar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" state={{from: location}} replace />
  );
};

export default PrivateRoute;
