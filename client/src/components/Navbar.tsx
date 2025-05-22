import bankLogo from '../assets/bankLogo.svg'
import { CreditCard, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from "react-router";
import { LayoutDashboard } from 'lucide-react';
import { Banknote } from 'lucide-react';

import axios from 'axios';


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await axios.post("http://localhost:3000/logout", {}, {withCredentials: true})
    const isSuccessfull = response.data.isSuccessfull
    console.log(isSuccessfull)
    if (isSuccessfull === true) {
      navigate("/")
    }
  }

  const navigationHeadings = [
    {name: "Dashboard", to: "/dashboard", image: <LayoutDashboard />},
    {name: "Transactions", to: "/transactions", image: <Banknote />},
    {name: "Accounts", to:"/accounts", image: <CreditCard />}
  ]

  return (
    <nav className="bg-[#1c2e4a] h-screen flex flex-col items-center w-48 flex-shrink-0">
      <div className='flex flex-col items-center gap-4'>
        <img className="w-28" src={bankLogo}/>
        <h1 className="text-white text-3xl font-serif drop-shadow-lg">Bank</h1>
      </div>
      <div className='flex flex-col gap-6 items-start mt-12'>
        {navigationHeadings.map((item) => (
          <NavLink 
          to={item.to} 
          className={({ isActive }) =>
              `${isActive ? "bg-white text-[#1c2e4a] font-semibold shadow-md" : "text-white hover:bg-white/20 hover:shadow-sm"} flex gap-3 py-3 px-5 rounded-xl duration-200`
          }
        >
          <span className="w-5 h-5">{item.image}</span>
          <span className="text-sm">{item.name}</span>
        </NavLink>
        ))}
      </div>
      <div className='flex-grow'></div>
      <div className="mb-6">
        <button className="text-white hover:text-red-400 transition duration-200" onClick={handleLogout}>
          <LogOut size={32} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;