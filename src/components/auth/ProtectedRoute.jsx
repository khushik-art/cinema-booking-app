import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "axios";

const ProtectedRoute = () => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthorized(false);
        setChecking(false);
        return;
      }

      try {
        await Axios.get("/api", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ Token valid
        setAuthorized(true);
      } catch (err) {
        // ❌ Token invalid / expired
        console.log(err);
        localStorage.removeItem("token");
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    validateToken();
  }, []);

  // ⏳ While validating token
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking authorization...</p>
      </div>
    );
  }

  // ❌ Not authorized
  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
};

export default ProtectedRoute;
