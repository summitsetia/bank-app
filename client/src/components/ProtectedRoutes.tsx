import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import client from "../api/axiosClient";
import Navbar from "./Navbar";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await client.post("/authenticate", {});
        const isUserAuthenticated = response.data.isAuthenticated;

        if (!isUserAuthenticated) {
          navigate("/");
        } else {
          setCheckingAuth(false);
        }
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };

    authenticate();
  }, [navigate]);

  if (checkingAuth) return <div className="p-4">Checking authentication...</div>;

  return (
    <div className="flex">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default ProtectedRoutes;
