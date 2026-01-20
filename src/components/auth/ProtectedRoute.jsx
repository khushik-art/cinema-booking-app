import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "axios";

const ProtectedRoute = () => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setAuthorized(false);
    navigate("/", { replace: true });
  };

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

        setAuthorized(true);
      } catch {
        logout();
      } finally {
        setChecking(false);
      }
    };

    validateToken();

    // 🔥 Detect token removal (same tab or other tabs)
    const handleStorage = () => {
      if (!localStorage.getItem("token")) {
        logout();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking authorization…</p>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
