import "./App.css";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import TicketList from "./pages/customer/TicketList";
import { Routes, Route } from "react-router-dom";

function App() {
  const user = {
    name: "Zeina",
    role: "customer",
    notifications: 2,
  };
  return (
    <div className="d-flex">
      <Sidebar role={user.role} />

      <div className="flex-grow-1 d-flex flex-column overflow-auto">
        <Navbar
          role={user.role}
          userName={user.name}
          notificationCount={user.notifications}
        />
        <main className="flex-grow-1 p-4 bg-white">
          <Routes>
            <Route
              path="/customer/tickets"
              element={<TicketList/>}
            />
            <Route
              path="/customer/notifications"
              element={<div>Notifications Page</div>}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
