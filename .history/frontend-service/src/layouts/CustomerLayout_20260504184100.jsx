// layouts/CustomerLayout.jsx
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

<<<<<<< HEAD
export default function CustomerLayout({ user }) {
=======
export default function CustomerLayout({ user, onLogout }) {
>>>>>>> frontend
  return (
    <div className="d-flex" style={{ backgroundColor: 'var(--neutral-white)', minHeight: '100vh' }}>
      <Sidebar role="customer" />
      <div className="flex-grow-1 d-flex flex-column">
<<<<<<< HEAD
        <Navbar role="customer" userName={user.name} notificationCount={user.notifications} />
=======
        <Navbar role="customer" userName={user.name} notificationCount={user.notifications} onLogout={onLogout} />
>>>>>>> frontend
        <main className="p-4 bg-white flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}