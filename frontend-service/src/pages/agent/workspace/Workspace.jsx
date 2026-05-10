import { useState, useEffect, useCallback } from 'react';
import styles from './Workspace.module.css';
import TicketModal from '../TicketModal';
import { getTickets, getUnassignedTickets, assignAgent, resolveTicket } from '../../../api';

export default function Workspace() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('unassigned');
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [assigned, unassigned] = await Promise.all([
        getTickets(),
        getUnassignedTickets()
      ]);
      const myTicketsList = Array.isArray(assigned) ? assigned : [];
      const unassignedList = Array.isArray(unassigned) ? unassigned : [];
      const allTickets = [...myTicketsList, ...unassignedList];
      const uniqueIds = [...new Set(allTickets.map(t => t.customerId).filter(Boolean))];
      const customerMap = {};
      await Promise.all(uniqueIds.map(async (id) => {
        try {
          const user = await fetch(`/api/users/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }).then(r => r.json());
          customerMap[id] = user.name || id;
        } catch {
          customerMap[id] = id;
        }
      }));
      setMyTickets(myTicketsList.map(t => ({ ...t, customerName: customerMap[t.customerId] || t.customerId })));
      setUnassignedTickets(unassignedList.map(t => ({ ...t, customerName: customerMap[t.customerId] || t.customerId })));
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchData();
  }, []);


  const handleAssignToMe = async (ticketId) => {
    try {
      const ticket = unassignedTickets.find(t => t._id === ticketId);
      if (!ticket) throw new Error("Ticket not found");
      const selectedPriority = ticket.priority || "Medium";
      await assignAgent(ticketId, currentUser._id, ticket.customerId, selectedPriority);
      await fetchData();
      setActiveTab('my-active');
    } catch (err) {
      console.error(err);
      alert("Assignment failed!");
    }
  };

  // Handle local priority change before assignment
  const handleLocalPriorityChange = (ticketId, newPriority) => {
    setUnassignedTickets(prev => prev.map(t =>
      t._id === ticketId ? { ...t, priority: newPriority } : t
    ));
  };

  const handleResolve = async (ticketId) => {
    try {
      await resolveTicket(ticketId);
      await fetchData();
      setSelectedTicket(null);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Could not resolve ticket.");
    }
  };

  const getDisplayTickets = () => {
    if (activeTab === 'unassigned') return unassignedTickets;
    if (activeTab === 'my-active') return myTickets.filter(t => t.status !== "Closed" && t.status !== "Resolved");
    if (activeTab === 'closed') return myTickets.filter(t => t.status === "Resolved" || t.status === "Closed");
    return [];
  };


  const displayTickets = getDisplayTickets();
  // Stat Values
  const queueCount = unassignedTickets.length;
  const myActiveCount = myTickets.filter(t => t.status !== "Closed" && t.status !== "Resolved").length;
  const urgentCount = myTickets.filter(t => t.priority === "High" && t.status !== "Closed" && t.status !== "Resolved").length;


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'var(--urgent-error-status)';
      case 'Medium': return 'var(--in-progress-status)';
      case 'Low': return 'var(--open-status)';
      default: return 'var(--primary-color)';
    }
  };

  if (loading) return <div className="text-center p-5">Loading Workspace...</div>;

  return (
    <div className={styles.workspaceContainer}>
      <h3 className="fw-bold mb-4">My Workspace</h3>
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--primary-color)' }}>
            <h2 className="fw-bold">{myTickets.length}</h2>
            <p className="mb-0 small">My Total History</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--open-status)' }}>
            <h2 className="fw-bold">{queueCount}</h2>
            <p className="mb-0 small">Unassigned Queue</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--in-progress-status)' }}>
            <h2 className="fw-bold">{myActiveCount}</h2>
            <p className="mb-0 small">My Active Tickets</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--urgent-error-status)' }}>
            <h2 className="fw-bold">{urgentCount}</h2>
            <p className="mb-0 small">Urgent (High Priority)</p>
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center mb-4 gap-2">
        <button className={`${styles.tabBtn} ${activeTab === 'unassigned' ? styles.activeTab : ''}`} onClick={() => setActiveTab('unassigned')}>
          Unassigned ({unassignedTickets.length})
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'my-active' ? styles.activeTab : ''}`} onClick={() => setActiveTab('my-active')}>
          My Active Tickets ({myTickets.filter(t => t.status !== "Closed" && t.status !== "Resolved").length})
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'closed' ? styles.activeTab : ''}`} onClick={() => setActiveTab('closed')}>
          Resolved ({myTickets.filter(t => t.status === "Resolved" || t.status === "Closed").length})
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
            {displayTickets.length > 0 ? displayTickets.map((t) => (
              <tr key={t._id}>
                <td className="ps-4 py-4">
                  <div className="fw-bold">#{t._id.slice(-4)}</div>
                  <div className="small text-muted">{t.title}</div>
                </td>
                <td>{t.customerName || t.customerId || 'Guest'}</td>
                <td>
                  <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: (t.status === 'Closed' || t.status === 'Resolved') ? 'var(--closed-status)' : 'var(--in-progress-status)' }}>
                    {t.status}
                  </span>
                </td>
                {/* <td>
                  <span className="badge px-3 py-2" style={{ backgroundColor: getPriorityColor(t.priority), borderRadius: '20px', minWidth: '80px' }}>
                    {t.priority || 'Low'}
                  </span>
                </td> */}
                <td>
                  {activeTab === 'unassigned' ? (
                    <select
                      className={`${styles.prioritySelect} form-select form-select-sm`}
                      value={t.priority || 'Low'}
                      onChange={(e) => handleLocalPriorityChange(t._id, e.target.value)}
                      style={{
                        borderColor: getPriorityColor(t.priority),
                        color: getPriorityColor(t.priority),
                        fontWeight: 'bold'
                      }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  ) : (
                    <span
                      className="badge px-3 py-2"
                      style={{
                        backgroundColor: getPriorityColor(t.priority),
                        borderRadius: '20px',
                        minWidth: '80px'
                      }}
                    >
                      {t.priority || 'Low'}
                    </span>
                  )}
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center">
                    {activeTab === 'closed' ? (
                      <button className="btn btn-sm btn-light border px-4" onClick={() => setSelectedTicket({ ...t, isReadOnly: true })}>View</button>
                    ) : activeTab === 'unassigned' ? (
                      <button className="btn btn-sm btn-primary px-3" style={{ backgroundColor: 'var(--primary-color)', border: 'none' }} onClick={() => handleAssignToMe(t._id)}>
                        Assign to me
                      </button>
                    ) : (
                      <button className={styles.resolveBtn} onClick={() => setSelectedTicket(t)}>Resolve</button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center py-4 text-muted">No tickets found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onRefresh={fetchData}
          onResolve={() => handleResolve(selectedTicket._id)}
        />
      )}
    </div>
  );
}