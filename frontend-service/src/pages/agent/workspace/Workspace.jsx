import { useState } from 'react';
import styles from './Workspace.module.css';
import TicketModal from '../TicketModal';
// import TicketDetailModal from '../TicketDetailsModal/TicketDetailsModal';

export default function Workspace() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('unassigned');

  const allTickets = [
    {
      id: 1,
      title: "Login page not loading on mobile browsers",
      customer: "Hafsa",
      status: "Closed",
      priority: "High",
      assignedTo: "Hafsa"
    },
    {
      id: 5,
      title: "Email notifications delayed by 2 hours",
      customer: "Hafsa",
      status: "In Progress",
      priority: "High",
      assignedTo: "Hafsa"
    },
    {
      id: 7,
      title: "Cannot reset password",
      customer: "Zeina",
      status: "Open",
      priority: "Critical",
      assignedTo: null
    }
  ];

  const filteredTickets = allTickets.filter(t => {
    if (activeTab === 'unassigned') return t.assignedTo === null;
    if (activeTab === 'my-active') return t.assignedTo === "Hafsa" && t.status !== "Closed";
    if (activeTab === 'closed') return t.status === "Closed";
    return true;
  });

  return (
    <div className={styles.workspaceContainer}>
      <h3 className="fw-bold mb-4">My Workspace</h3>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--primary-color)' }}>
            <h2 className="fw-bold">2</h2>
            <p className="mb-0 small">My Tickets</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--open-status)' }}>
            <h2 className="fw-bold">1</h2>
            <p className="mb-0 small">Open</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--in-progress-status)' }}>
            <h2 className="fw-bold">1</h2>
            <p className="mb-0 small">In progress</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--urgent-error-status)' }}>
            <h2 className="fw-bold">1</h2>
            <p className="mb-0 small">Need Response</p>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center mb-4 gap-2">
        <button
          className={`${styles.tabBtn} ${activeTab === 'unassigned' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('unassigned')}
        >
          Unassigned ({allTickets.filter(t => !t.assignedTo).length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'my-active' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('my-active')}
        >
          My Active Tickets
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'closed' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('closed')}
        >
          Resolved
        </button>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="table align-middle mb-0">
          <thead className={styles.tableHeader}>
            <tr>
              <th className="ps-4 py-3">Ticket</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Priority</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t) => (
                <tr key={t.id}>
                  <td className="ps-4 py-4">
                    <div className="fw-bold">#{t.id}</div>
                    <div className="small text-muted">{t.title}</div>
                  </td>
                  <td>{t.customer}</td>
                  <td>
                    <span
                      className="badge rounded-pill px-3 py-2"
                      style={{ backgroundColor: t.status === 'Closed' ? 'var(--closed-status)' : 'var(--in-progress-status)' }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-danger px-3 py-2">
                      {t.priority}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      {/* <button
                        className="btn btn-sm btn-light border px-3"
                        onClick={() => setSelectedTicket({ ...t, isReadOnly: true })}
                      >
                        View
                      </button> */}
                      <button
                        className={styles.resolveBtn}
                        onClick={() => setSelectedTicket(t)}
                      >
                        Resolve
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  No tickets found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}