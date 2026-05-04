<<<<<<< HEAD

function Navbar({ role, userName, notificationCount = 0 }) {
=======
import styles from './Sidebar.module.css';
import { useNavigate } from 'react-router-dom';

function Navbar({ role, userName, notificationCount = 0, onLogout }) {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    onLogout();
    navigate('/auth');
  };
>>>>>>> frontend
  return (
    <nav className="navbar navbar-expand bg-white border-bottom px-4 py-3 sticky-top">
      <div className="container-fluid d-flex justify-content-end align-items-center">

        {/* Conditional Notification Bell (shown for customers) */}
        {role === 'customer' && (
          <div className="position-relative me-4" style={{ cursor: 'pointer' }}>
            <div
              className="bg-light rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bi bi-bell fs-5"></i>
            </div>
            {notificationCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white"
                style={{ fontSize: '0.65rem' }}
              >
                {notificationCount}
              </span>
            )}
          </div>
        )}

        {/* User Greeting Button */}
        <button
          className="btn btn-dark px-4 py-2  fw-semibold border-0"
          style={{ backgroundColor: '#0a0c14', borderRadius: '10px' }}
        >
          Hello, {userName}
        </button>
<<<<<<< HEAD
=======

        {/* Logout Button */}
        <button
          className={styles.logoutBtn}
          onClick={handleLogoutClick}
          title="Logout"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
>>>>>>> frontend
      </div>
    </nav>
  );

}

export default Navbar
