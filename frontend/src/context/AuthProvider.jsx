import React, { useEffect } from "react";
import { createContext, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie/lib";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const API_URL = "http://localhost:8080/api";
  const cookies = new Cookies();
  const [user, setUser] = useState(() =>
    cookies.get("authToken") ? jwtDecode(cookies.get("authToken")) : null
  );
  const [authToken, setAuthToken] = useState(() =>
    cookies.get("authToken") ? cookies.get("authToken") : null
  );
  const [refToken, setRefToken] = useState(() =>
    cookies.get("refToken") ? cookies.get("refToken") : null
  );
  const [role, setRole] = useState(() =>
    cookies.get("authToken") ? jwtDecode(cookies.get("authToken")).role : null
  );
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = React.useState();
  const [userSchool, setUserSchool] = React.useState();

  const navigate = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch("http://127.0.0.1:8000/api/auth/token/obtain", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthToken(data.access);
      setRefToken(data.refresh);
      setUser(jwtDecode(data.access));
      //   console.log(jwtDecode(data.access));
      cookies.set("authToken", data.access, { path: "/" });
      cookies.set("refToken", data.refresh, { path: "/" });

      navigate("/");
    }
  };

  let logoutUser = () => {
    setAuthToken(null);
    setRefToken(null);
    setUser(null);
    // localStorage.removeItem('authToken');
    cookies.remove("authToken");
    cookies.remove("refToken");
    navigate("/login");
  };

  let updateToken = async () => {
    if (refToken !== null) {
      let response = await fetch(
        "http://127.0.0.1:8000/api/auth/token/refresh",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ refresh: refToken }),
        }
      );
      let data = await response.json();
      if (response.status === 200) {
        setAuthToken(data.access);
        setUser(jwtDecode(data.access));
        cookies.set("authToken", data.access, { path: "/" });
      } else {
        console.log("fail");
        logoutUser();
      }
    }
    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }
    let fourMin = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (refToken) {
        updateToken();
      }
    }, fourMin);
    return () => clearInterval(interval);
  }, [refToken, loading]);

  React.useEffect(() => {
    let requestUserInfo = async () => {
      if (user) {
        return fetch(`http://127.0.0.1:8000/api/users/me`, {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${authToken}`,
          }),
        })
          .then((response) => response.json())
          .then((json) => setUserInfo(json));
      }
    };
    requestUserInfo();
  }, [user]);

  React.useEffect(() => {
    let requestUserSchool = async () => {
      if (userInfo?.school_id) {
        return fetch(
          `http://127.0.0.1:8000/api/schools/${userInfo?.school_id}`,
          {
            method: "GET",
            headers: new Headers({
              Authorization: `Bearer ${authToken}`,
            }),
          }
        )
          .then((response) => response.json())
          .then((json) => setUserSchool(json));
      }
    };
    requestUserSchool();
  }, [userInfo]);

  let contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    userInfo: userInfo,
    userSchool: userSchool,
    authToken: authToken,
    role,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
