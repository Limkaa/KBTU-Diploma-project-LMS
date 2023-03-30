import { Outlet, Navigate, useLocation } from "react-router-dom";
import NavBar from "../components/Navbar/Navbar";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../redux/auth/authSlice";

const PrivateRoute = ({ allowedRoles }) => {
  console.log(allowedRoles, role);

  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  return user !== null && allowedRoles?.includes(user?.role) ? (
    <div className="body-container">
      <NavBar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" state={{from: location}} replace />
  );
};

export default PrivateRoute;
