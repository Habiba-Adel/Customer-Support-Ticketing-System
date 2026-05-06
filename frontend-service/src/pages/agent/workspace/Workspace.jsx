// import { useState, useEffect } from 'react';
// import styles from './Workspace.module.css';
// import TicketModal from '../TicketModal';
// import { getTickets, getUnassignedTickets, assignAgent, resolveTicket } from '../../../api';

// export default function Workspace() {
//   // const [selectedTicket, setSelectedTicket] = useState(null);
//   // const [activeTab, setActiveTab] = useState('unassigned');
//   // const [tickets, setTickets] = useState([]);
//   // const [loading, setLoading] = useState(true);

//   // const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

//   // const [tickets, setTickets] = useState([
//   //   { id: 1, title: "Login page not loading on mobile browsers", customer: "Hafsa", status: "Closed", priority: "High", assignedTo: "Hafsa" },
//   //   { id: 5, title: "Email notifications delayed by 2 hours", customer: "Hafsa", status: "In Progress", priority: "High", assignedTo: "Hafsa" },
//   //   { id: 7, title: "Cannot reset password", customer: "Zeina", status: "Open", priority: "Medium", assignedTo: null }
//   // ]);

//   const [unassignedTickets, setUnassignedTickets] = useState([]);
//   const [myTickets, setMyTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [unassigned, assigned] = await Promise.all([
//         getUnassignedTickets(),
//         getTickets()
//       ]);
//       setUnassignedTickets(Array.isArray(unassigned) ? unassigned : []);
//       setMyTickets(Array.isArray(assigned) ? assigned : []);
//     } catch (err) {
//       console.error("Failed to fetch tickets:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch Real Data
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // const fetchData = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const data = await getTickets();
//   //     setTickets(Array.isArray(data) ? data : []);
//   //   } catch (err) {
//   //     console.error("Failed to fetch tickets:", err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleAssignToMe = async (ticketId) => {
//     try {
//       // Use currentUser.id from the login state
//       await assignAgent(ticketId, currentUser._id);
//       // Refresh list after assignment
//       await fetchData();
//       setActiveTab('my-active');
//     } catch (err) {
//       alert("Assignment failed!");
//     }
//   };

//     // Filter for display depends on activeTab
//   const getDisplayTickets = () => {
//     if (activeTab === 'unassigned') return unassignedTickets;
//     if (activeTab === 'my-active') return myTickets.filter(t => t.status !== "Closed");
//     if (activeTab === 'closed') return myTickets.filter(t => t.status === "Closed");
//     return [];
//   };

//   const handleResolve = async (ticketId) => {
//     try {
//       await resolveTicket(ticketId);
//       await fetchData();
//       setSelectedTicket(null);
//     } catch (err) {
//       alert("Could not resolve ticket.");
//     }
//   };

//   const handleUpdateTicket = (id, newPriority, newAssignee = null) => {
//     setTickets(prev => prev.map(t =>
//       t.id === id
//         ? { ...t, priority: newPriority, assignedTo: newAssignee !== null ? newAssignee : t.assignedTo }
//         : t
//     ));
//   };

//   const filteredTickets = tickets.filter(t => {
//     if (activeTab === 'unassigned') return !t.assignedTo;
//     if (activeTab === 'my-active') return t.assignedTo === currentUser.id && t.status !== "Closed";
//     if (activeTab === 'closed') return t.status === "Closed";
//     return true;
//   });

//   if (loading) return <div className="text-center p-5">Loading Workspace...</div>;

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'High': return 'var(--urgent-error-status)';
//       case 'Medium': return 'var(--in-progress-status)';
//       case 'Low': return 'var(--open-status)';
//       default: return 'var(--primary-color)';
//     }
//   };

//   return (
//     <div className={styles.workspaceContainer}>
//       <h3 className="fw-bold mb-4">My Workspace</h3>

//       {/* Stats Cards */}
//       <div className="row g-4 mb-5">
//         <div className="col-md-3">
//           <div className={styles.statCard} style={{ backgroundColor: 'var(--primary-color)' }}>
//             <h2 className="fw-bold">{tickets.filter(t => t.assignedTo === currentUser.id).length}</h2>
//             <p className="mb-0 small">My Tickets</p>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className={styles.statCard} style={{ backgroundColor: 'var(--open-status)' }}>
//             <h2 className="fw-bold">{tickets.filter(t => t.status === "Open").length}</h2>
//             <p className="mb-0 small">Open</p>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className={styles.statCard} style={{ backgroundColor: 'var(--in-progress-status)' }}>
//             <h2 className="fw-bold">{tickets.filter(t => t.status === "In Progress").length}</h2>
//             <p className="mb-0 small">In Progress</p>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className={styles.statCard} style={{ backgroundColor: 'var(--urgent-error-status)' }}>
//             <h2 className="fw-bold">{tickets.filter(t => t.priority === "High" && t.status !== "Closed").length}</h2>
//             <p className="mb-0 small">Need Response</p>
//           </div>
//         </div>
//       </div>

//       {/* Tab Navigation */}
//       <div className="d-flex align-items-center mb-4 gap-2">
//         <button className={`${styles.tabBtn} ${activeTab === 'unassigned' ? styles.activeTab : ''}`} onClick={() => setActiveTab('unassigned')}>
//           Unassigned ({tickets.filter(t => !t.assignedTo).length})
//         </button>
//         <button className={`${styles.tabBtn} ${activeTab === 'my-active' ? styles.activeTab : ''}`} onClick={() => setActiveTab('my-active')}>
//           My Active Tickets
//         </button>
//         <button className={`${styles.tabBtn} ${activeTab === 'closed' ? styles.activeTab : ''}`} onClick={() => setActiveTab('closed')}>
//           Resolved
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded shadow-sm overflow-hidden">
//         <table className="table align-middle mb-0">
//           <thead className={styles.tableHeader}>
//             <tr>
//               <th className="ps-4 py-3">Ticket</th>
//               <th>Customer</th>
//               <th>Status</th>
//               <th>Priority</th>
//               <th className="text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTickets.length > 0 ? filteredTickets.map((t) => (
//               <tr key={t._id || t.id}>
//                 <td className="ps-4 py-4">
//                   <div className="fw-bold">#{t.id || t._id?.slice(-4)}</div>
//                   <div className="small text-muted">{t.title}</div>
//                 </td>
//                 <td>{t.customerName || t.customer || 'Guest'}</td>
//                 <td>
//                   <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: t.status === 'Closed' ? 'var(--closed-status)' : 'var(--in-progress-status)' }}>
//                     {t.status}
//                   </span>
//                 </td>
//                 <td>
//                   <span className="badge px-3 py-2" style={{ backgroundColor: getPriorityColor(t.priority), borderRadius: '20px', minWidth: '80px' }}>
//                     {t.priority || 'Low'}
//                   </span>
//                 </td>
//                 <td className="text-center">
//                   <div className="d-flex justify-content-center">
//                     {activeTab === 'closed' ? (
//                       <button className="btn btn-sm btn-light border px-4" onClick={() => setSelectedTicket({ ...t, isReadOnly: true })}>View</button>
//                     ) : activeTab === 'unassigned' ? (
//                       <button
//                         className="btn btn-sm btn-primary px-3"
//                         style={{ backgroundColor: 'var(--primary-color)', border: 'none' }}
//                         onClick={() => handleAssignToMe(t._id || t.id)}
//                       >
//                         Assign to me
//                       </button>
//                     ) : (
//                       <button className={styles.resolveBtn} onClick={() => setSelectedTicket(t)}>Resolve</button>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             )) : (
//               <tr>
//                 <td colSpan="5" className="text-center py-4 text-muted">No tickets found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {selectedTicket && (
//         <TicketModal
//           ticket={selectedTicket}
//           onClose={() => setSelectedTicket(null)}
//           onRefresh={fetchData}
//           onResolve={() => handleResolve(selectedTicket._id || selectedTicket.id)}
//         />
//       )}
//     </div>
//   );
// }

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

// 1. Add 'isRefresh' parameter to control when loading state is toggled
const fetchData = useCallback(async (isRefresh = false) => {
  // Only set loading to true if this is a manual refresh.
  // On initial mount, 'loading' is already true, so we skip this to avoid the warning.
  if (isRefresh) {
    setLoading(true);
  }

  try {
    const [unassignedData, myData] = await Promise.all([
      getUnassignedTickets(),
      getTickets()
    ]);

    setUnassignedTickets(Array.isArray(unassignedData) ? unassignedData : []);
    setMyTickets(Array.isArray(myData) ? myData : []);
  } catch (err) {
    console.error("FETCH ERROR:", err);
  } finally {
    // This is asynchronous (happens after the await), so it's safe!
    setLoading(false);
  }
}, []);

// 2. Initial trigger (no arguments passed, so isRefresh is false)
useEffect(() => {
  fetchData();
}, [fetchData]);

// 3. Manual refresh trigger (passes true to show the loading state)
const handleRefresh = () => {
  fetchData(true);
};

  // 4. DISPLAY LOGIC (Defined before use)
  const getDisplayTickets = () => {
    if (activeTab === 'unassigned') return unassignedTickets;
    if (activeTab === 'my-active') return myTickets.filter(t => t.status !== "Closed" && t.status !== "Resolved");
    if (activeTab === 'closed') return myTickets.filter(t => t.status === "Closed" || t.status === "Resolved");
    return [];
  };

  const handleAssignToMe = async (ticketId) => {
    try {
      // Use _id because your MERN backend likely uses MongoDB
      await assignAgent(ticketId, currentUser._id || currentUser.id);
      await handleRefresh(); 
      setActiveTab('my-active');
    } catch (err) {
      alert("Assignment failed!");
    }
  };

  const handleResolve = async (ticketId) => {
    try {
      await resolveTicket(ticketId);
      await handleRefresh();
      setSelectedTicket(null);
    } catch (err) {
      alert("Could not resolve ticket.");
    }
  };

  const displayTickets = getDisplayTickets();

  // Stats
  const myOpenTickets = myTickets.filter(t => t.status === "Open").length;
  const myInProgress = myTickets.filter(t => t.status === "In Progress").length;
  const myHighPriorityActive = myTickets.filter(t => t.priority === "High" && t.status !== "Closed").length;

  if (loading) return <div className="text-center p-5">Loading Workspace...</div>;

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

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--primary-color)' }}>
            <h2 className="fw-bold">{myTickets.length}</h2>
            <p className="mb-0 small">My Tickets</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--open-status)' }}>
            <h2 className="fw-bold">{myOpenTickets}</h2>
            <p className="mb-0 small">Open</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--in-progress-status)' }}>
            <h2 className="fw-bold">{myInProgress}</h2>
            <p className="mb-0 small">In Progress</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.statCard} style={{ backgroundColor: 'var(--urgent-error-status)' }}>
            <h2 className="fw-bold">{myHighPriorityActive}</h2>
            <p className="mb-0 small">Need Response</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="d-flex align-items-center mb-4 gap-2">
        <button className={`${styles.tabBtn} ${activeTab === 'unassigned' ? styles.activeTab : ''}`} onClick={() => setActiveTab('unassigned')}>
          Unassigned ({unassignedTickets.length})
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'my-active' ? styles.activeTab : ''}`} onClick={() => setActiveTab('my-active')}>
          My Active Tickets
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'closed' ? styles.activeTab : ''}`} onClick={() => setActiveTab('closed')}>
          Resolved
        </button>
      </div>

      {/* Table */}
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
                  <div className="fw-bold">#{t._id?.slice(-4) || 'N/A'}</div>
                  <div className="small text-muted">{t.title}</div>
                </td>
                <td>{t.customerName || t.customerId || 'Guest'}</td>
                <td>
                  <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: t.status === 'Closed' ? 'var(--closed-status)' : 'var(--in-progress-status)' }}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <span className="badge px-3 py-2" style={{ backgroundColor: getPriorityColor(t.priority), borderRadius: '20px', minWidth: '80px' }}>
                    {t.priority || 'Low'}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center">
                    {activeTab === 'closed' ? (
                      <button className="btn btn-sm btn-light border px-4" onClick={() => setSelectedTicket({ ...t, isReadOnly: true })}>View</button>
                    ) : activeTab === 'unassigned' ? (
                      <button
                        className="btn btn-sm btn-primary px-3"
                        style={{ backgroundColor: 'var(--primary-color)', border: 'none' }}
                        onClick={() => handleAssignToMe(t._id)}
                      >
                        Assign to me
                      </button>
                    ) : (
                      <button className={styles.resolveBtn} onClick={() => setSelectedTicket(t)}>Resolve</button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">No tickets found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onRefresh={handleRefresh}
          onResolve={() => handleResolve(selectedTicket._id)}
        />
      )}
    </div>
  );
}