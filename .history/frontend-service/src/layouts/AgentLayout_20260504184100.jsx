// layouts/AgentLayout.jsx
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

<<<<<<< HEAD
export default function AgentLayout({ user }) {
=======
export default function AgentLayout({ user, onLogout }) {
>>>>>>> frontend
  return (
    <div className="d-flex" style={{ backgroundColor: 'var(--neutral-white)', minHeight: '100vh' }}>
      <Sidebar role="agent" />
      <div className="flex-grow-1 d-flex flex-column">
<<<<<<< HEAD
        <Navbar role="agent" userName={user.name} />
=======
        <Navbar role="agent" userName={user.name} onLogout={onLogout} />
>>>>>>> frontend
        <main className="p-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}