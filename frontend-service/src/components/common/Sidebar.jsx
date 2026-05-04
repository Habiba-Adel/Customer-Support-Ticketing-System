import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'
export default function Sidebar({ role = "customer" }) {
  const menuConfig = {
    customer: {
      portalName: "Customer Portal",
      basePath: "/customer",
      items: [
        { path: "tickets", label: "My Tickets", icon: "bi-ticket-perforated" },
        { path: "notifications", label: "Notifications", icon: "bi-bell" },
      ],
    },
    agent: {
      portalName: "Agent Portal",
      basePath: "/agent",
      items: [
        // { path: "all-tickets", label: "All Tickets", icon: "bi-ticket-detailed" },
        { path: "workspace", label: "My Workspace", icon: "bi-briefcase" },
        { path: "reports", label: "Reports", icon: "bi-graph-up-arrow" },
      ],
    },
  };

  //customer is the default
  const config = menuConfig[role] || menuConfig.customer;

  return (
    <div className={styles.sidebar}>
      {/* Header Section */}
      <div className="mb-3">
        <h4 className={`text-primary fw-bold mb-0 ${styles.portalName}`}>Support System</h4>
        <small className={`text-muted ${styles.portalName}`}>{config.portalName}</small>

        {/* <div className="d-block d-lg-none text-primary fw-bold fs-4 text-center"></div> */}
      </div>

      <hr className="mt-0 mb-4" />

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mb-auto">
        {config.items.map((item) => (
          <li className="nav-item mb-2" key={item.path}>
            <NavLink
              to={`${config.basePath}/${item.path}`}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeLink : ''}`
              }
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );

}
