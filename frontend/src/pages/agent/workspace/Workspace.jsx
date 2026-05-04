import { useState } from 'react';
import styles from './Workspace.module.css';
import TicketModal from '../TicketModal';

export default function Workspace() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('unassigned');

  const [tickets, setTickets] = useState([
    { id: 1, title: "Login page not loading on mobile browsers", customer: "Hafsa", status: "Closed", priority: "High", assignedTo: "Hafsa" },
    { id: 5, title: "Email notifications delayed by 2 hours", customer: "Hafsa", status: "In Progress", priority: "High", assignedTo: "Hafsa" },
    { id: 7, title: "Cannot reset password", customer: "Zeina", status: "Open", priority: "Medium", assignedTo: null }
  ]);

  const handleUpdateTicket = (id, newPriority, newAssignee = null) => {
    setTickets(prev => prev.map(t =>
      t.id === id
        ? { ...t, priority: newPriority, assignedTo: newAssignee !== null ? newAssignee : t.assignedTo }
        : t
    ));
  };

  const filteredTickets = tickets.filter(t => {
    if (activeTab === 'unassigned') return t.assignedTo === null;
    if (activeTab === 'my-active') return t.assignedTo === "Hafsa" && t.status !== "Closed";
    if (activeTab === 'closed') return t.status === "Closed";
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'var(--urgent-error-status)';
      case 'Medium': return 'var(--in-progress-status)';
      case 'Low': return 'var(--open-status)';
      default: return 'var(--primary-color)';
    }
  };

  return (
    <div className={styles.workspaceContainer}>
      <h3 className="fw-bold mb-4">My Workspace</h3>

      <div className="row g-4 mb-5">
        {/* Card 1: My Tickets */}
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--primary-color)' }}>
            <h2 className="fw-bold">{tickets.filter(t => t.assignedTo === "Hafsa").length}</h2>
            <p className="mb-0 small">My Tickets</p>
          </div>
        </div>

        {/* Card 2: Open Tickets */}
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--open-status)' }}>
            <h2 className="fw-bold">{tickets.filter(t => t.status === "Open").length}</h2>
            <p className="mb-0 small">Open</p>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--in-progress-status)' }}>
            <h2 className="fw-bold">{tickets.filter(t => t.status === "In Progress").length}</h2>
            <p className="mb-0 small">In Progress</p>
          </div>
        </div>

        {/* Card 4: High Priority (Need Response) */}
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--urgent-error-status)' }}>
            <h2 className="fw-bold">{tickets.filter(t => t.priority === "High" && t.status !== "Closed").length}</h2>
            <p className="mb-0 small">Need Response</p>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center mb-4 gap-2">
        <button className={`${styles.tabBtn} ${activeTab === 'unassigned' ? styles.activeTab : ''}`} onClick={() => setActiveTab('unassigned')}>
          Unassigned ({tickets.filter(t => !t.assignedTo).length})
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'my-active' ? styles.activeTab : ''}`} onClick={() => setActiveTab('my-active')}>
          My Active Tickets
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'closed' ? styles.activeTab : ''}`} onClick={() => setActiveTab('closed')}>
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
            {filteredTickets.map((t) => (
              <tr key={t.id}>
                <td className="ps-4 py-4">
                  <div className="fw-bold">#{t.id}</div>
                  <div className="small text-muted">{t.title}</div>
                </td>
                <td>{t.customer}</td>
                <td>
                  <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: t.status === 'Closed' ? 'var(--closed-status)' : 'var(--in-progress-status)' }}>
                    {t.status}
                  </span>
                </td>
                <td>
                  {t.status === 'Closed' ? (
                    <span className="badge px-3 py-2" style={{ backgroundColor: getPriorityColor(t.priority), borderRadius: '20px', minWidth: '80px' }}>
                      {t.priority}
                    </span>
                  ) : (
                    <select
                      className="form-select form-select-sm border-0 fw-bold text-white text-center"
                      value={t.priority}
                      onChange={(e) => handleUpdateTicket(t.id, e.target.value)}
                      style={{
                        backgroundColor: getPriorityColor(t.priority),
                        borderRadius: '20px',
                        cursor: 'pointer',
                        width: '100px'
                      }}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  )}
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center">
                    {activeTab === 'closed' ? (
                      <button
                        className="btn btn-sm btn-light border px-4"
                        style={{ borderRadius: '8px', fontWeight: '500' }}
                        onClick={() => setSelectedTicket({ ...t, isReadOnly: true })}
                      >
                        View
                      </button>
                    ) : activeTab === 'unassigned' ? (
                      <button
                        className="btn btn-sm btn-primary px-3"
                        style={{ borderRadius: '8px', fontWeight: '500', backgroundColor: 'var(--primary-color)', border: 'none' }}
                        onClick={() => {
                          handleUpdateTicket(t.id, t.priority, "Hafsa");
                          setActiveTab('my-active');
                        }}
                      >
                        Assign to me
                      </button>
                    ) : (
                      <button
                        className={styles.resolveBtn}
                        style={{ padding: '6px 20px' }}
                        onClick={() => setSelectedTicket(t)}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicket && <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
    </div>
  );
}
