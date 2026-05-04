// src/components/common/MainLayout.jsx
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout({ children, role, userName, notificationCount }) {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ width: '260px', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <Sidebar role={role} />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1" style={{ marginLeft: '260px' }}>
        <Navbar role={role} userName={userName} notificationCount={notificationCount} />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}