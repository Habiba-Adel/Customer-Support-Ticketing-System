// layouts/CustomerLayout.jsx
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

export default function CustomerLayout({ user, onLogout }) {
  return (
    <div className="d-flex" style={{ backgroundColor: 'var(--neutral-white)', minHeight: '100vh' }}>
      <Sidebar role="customer" />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar role="customer" userName={user.name} notificationCount={user.notifications} onLogout={onLogout} />
        <main className="p-4 bg-white flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}