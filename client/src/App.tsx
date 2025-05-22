import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Transactions from "./pages/transactions/Transactions";
import Welcome from "./pages/welcome/Welcome"
import Register from "./pages/register/Register"
import NotFound from "./pages/error/NotFound";
import Navbar from "./components/Navbar"
import Accounts from "./pages/accounts/Accounts";

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/register";

  return (
    <div className={hideNavbar ? "" : "flex"}>
      {!hideNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;