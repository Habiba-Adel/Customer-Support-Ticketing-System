<<<<<<< HEAD
import "./App.css";
import CustomerLayout from "./layouts/CustomerLayout";
import AgentLayout from "./layouts/AgentLayout";
import TicketList from "./pages/customer/TicketList";
import { Routes, Route, Navigate } from "react-router-dom";
import Reports from "./pages/agent/Reports/Reports";
import Workspace from "./pages/agent/workspace/Workspace";

function App() {
  // Role will be changed based on authentication 
  const user = {
    name: "Hafsa",
    role: "agent",
    notifications: 2,
  };
  //   return (
  //     <div className="d-flex">
  //       <Sidebar role={user.role} />

  //       <div className="flex-grow-1 d-flex flex-column overflow-auto">
  //         <Navbar
  //           role={user.role}
  //           userName={user.name}
  //           notificationCount={user.notifications}
  //         />
  //         <main className="flex-grow-1 p-4 bg-white">
  //           <Routes>
  //             <Route
  //               path="/customer/tickets"
  //               element={<TicketList/>}
  //             />
  //             <Route
  //               path="/customer/notifications"
  //               element={<div>Notifications Page</div>}
  //             />
  //           </Routes>
  //         </main>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user.role === 'agent' ? "/agent/reports" : "/customer/tickets"} />}
      />
      {/* Customer Routes Group */}
      {user.role === 'customer' && (
        <Route path="/customer" element={<CustomerLayout user={user} />}>
          <Route path="tickets" element={<TicketList />} />
          <Route path="notifications" element={<div>Notifications Page</div>} />
        </Route>
      )}

      {/* Agent Routes Group */}
      {user.role === 'agent' && (
        <Route path="/agent" element={<AgentLayout user={user} />}>
          <Route path="reports" element={<Reports />} />
          {/* <Route path="all-tickets" element={<div>All Tickets</div>} /> */}
          <Route path="workspace" element={<Workspace />} />
        </Route>
      )}
      <Route path="*" element={<Navigate to="/" />} />
=======
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Auth from "./Authentication/Auth";
import Workspace from "./pages/agent/workspace/Workspace";
import Reports from "./pages/agent/Reports/Reports";
import Notifications from "./pages/customer/Notifications";
import TicketList from "./pages/customer/TicketList";
import CustomerLayout from "./layouts/CustomerLayout";
import AgentLayout from "./layouts/AgentLayout";

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
          <Route path="notifications" element={<Notifications/>} />
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
>>>>>>> frontend
    </Routes>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> frontend
