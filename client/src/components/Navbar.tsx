import { CreditCard, LogOut, LayoutDashboard, Banknote } from 'lucide-react';
import { NavLink, useNavigate } from "react-router";
import bankLogo from '../assets/bankLogo.png';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
    if (response.data.isSuccessful) {
      navigate("/");
    }
  };

  const navigationHeadings = [
    { name: "Dashboard", to: "/dashboard", icon: <LayoutDashboard /> },
    { name: "Transactions", to: "/transactions", icon: <Banknote /> },
    { name: "Accounts", to: "/accounts", icon: <CreditCard /> }
  ];

  return (
    <nav className="bg-gray-50 h-screen flex flex-col items-center w-52 flex-shrink-0 py-6 border-r border-gray-300 fixed left-0 top-0">
      <div className="flex flex-col items-center gap-4">
        <img className="w-36 h-auto" src={bankLogo} alt="Bank Logo" />
      </div>

      <div className="flex flex-col gap-4 items-start mt-12 w-full px-4">
        {navigationHeadings.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `${isActive
                ? "bg-white text-[#1c2e4a] font-semibold shadow-md"
                : "text-[#1c2e4a] hover:bg-white/70 hover:shadow-sm"
              } w-full text-sm gap-3 py-3 px-4 rounded-xl transition duration-200 flex items-center`
            }
          >
            <div className="w-5 h-5">{item.icon}</div>
            <span className="text-sm leading-none ml-2">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="flex-grow" />

      <div className="mb-4">
        <button
          className="text-[#1c2e4a] hover:text-red-500 transition duration-200"
          onClick={handleLogout}
        >
          <LogOut size={28} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;