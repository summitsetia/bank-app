import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Transactions from "./pages/transactions/Transactions";
import Welcome from "./pages/welcome/Welcome"
import Register from "./pages/register/Register"
import NotFound from "./pages/error/NotFound";
import Accounts from "./pages/accounts/Accounts";
import ProtectedRoutes from "./components/ProtectedRoutes";

const AppContent = () => {
  return (   
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/accounts" element={<Accounts />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;