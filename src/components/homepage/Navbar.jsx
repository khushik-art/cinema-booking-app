import Logo from "../../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/home";
  const isMyTicket = location.pathname === "/tickets";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const activeClass =
    "text-sky-600 border-b-2 border-sky-600 font-medium";

  const inactiveClass =
    "text-slate-700 hover:text-sky-600";

  return (
    <header className="w-full h-[85px] bg-gradient-to-r from-white to-sky-100 border-b">
      <div className="relative max-w-full h-full mx-auto px-10 flex items-center">

        {/* Logo */}
        <img src={Logo} alt="logo" className="h-[42px]" />

        {/* Center Nav */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex gap-8">
          <span
            onClick={() => navigate("/home")}
            className={`cursor-pointer pb-1 ${
              isHome ? activeClass : inactiveClass
            }`}
          >
            Home
          </span>

          <span
            onClick={() => navigate("/tickets")}
            className={`cursor-pointer pb-1 ${
              isMyTicket ? activeClass : inactiveClass
            }`}
          >
            My Ticket
          </span>
        </nav>

        {/* Logout */}
        <div className="ml-auto">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
