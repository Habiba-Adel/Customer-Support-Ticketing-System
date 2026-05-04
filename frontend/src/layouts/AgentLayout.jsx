// layouts/AgentLayout.jsx
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

export default function AgentLayout({ user }) {
  return (
    <div className="d-flex" style={{ backgroundColor: 'var(--neutral-white)', minHeight: '100vh' }}>
      <Sidebar role="agent" />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar role="agent" userName={user.name} />
        <main className="p-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}