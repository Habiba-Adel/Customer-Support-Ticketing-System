import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Auth from "./Authentication/Auth";
import Workspace from "./pages/agent/workspace/Workspace";
import Reports from "./pages/agent/Reports/Reports";
import Notifications from "./pages/customer/Notifications";
import TicketList from "./pages/customer/TicketList";
import CustomerLayout from "./layouts/CustomerLayout";
import AgentLayout from "./layouts/AgentLayout";
import { Toaster } from 'react-hot-toast';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState({
    name: "Hafsa",
    role: "agent",
    notifications: 2,
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ name: "", role: "", notifications: 0 });
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route
          path="/auth"
          element={<Auth onLogin={handleLogin} />}
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={user.role === 'agent' ? "/agent/workspace" : "/customer/tickets"} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />


        {isAuthenticated && user.role === 'customer' && (
          <Route path="/customer" element={<CustomerLayout user={user} onLogout={handleLogout} />}>
            <Route path="tickets" element={<TicketList />} />
            <Route path="notifications" element={<Notifications />} />
            <Route index element={<Navigate to="tickets" />} />
          </Route>
        )}

        {isAuthenticated && user.role === 'agent' && (
          <Route path="/agent" element={<AgentLayout user={user} onLogout={handleLogout} />}>
            <Route path="reports" element={<Reports />} />
            <Route path="workspace" element={<Workspace />} />
            <Route index element={<Navigate to="workspace" />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </>
  );
}

export default App;