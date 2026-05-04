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
    </Routes>
  );
}

export default App;
