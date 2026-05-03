import { useState, useEffect } from 'react';
import styles from './TicketList.module.css';
import CreateTicketModal from './CreateTicketModal'; // Import the modal

const TicketList = () => {
  const [showModal, setShowModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = [
          { id: 1, title: "Login page not loading on mobile browsers", status: "Open", date: "Apr 28, 2026" },
          { id: 2, title: "Unable to reset password", status: "Open", date: "Apr 27, 2026" },
          { id: 3, title: "Email notifications delayed by 2 hours", status: "In Progress", date: "Apr 26, 2026" },
          { id: 4, title: "Profile image upload fails", status: "Closed", date: "Apr 24, 2026" },
        ];
        
        setTickets(mockData);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCreateTicket = (formData) => {
    const newTicket = {
      id: tickets.length + 1,
      title: formData.title,
      status: "Open",
      date: new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      }).format(new Date())
    };
    
    setTickets([newTicket, ...tickets]);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Open": return styles.statusOpen;
      case "In Progress": return styles.statusInProgress;
      case "Closed": return styles.statusClosed;
      default: return "";
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className="fw-bold">Your Tickets</h2>
        <button 
          className="btn btn-primary px-4 py-2 fw-semibold" 
          style={{ backgroundColor: '#0052cc' }}
          onClick={() => setShowModal(true)}
        >
          Create Ticket
        </button>
      </div>

      <div className="table-responsive">
        <table className={`table ${styles.table}`}>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col" className="text-center">Status</th>
              <th scope="col" className="text-end">Created Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td className="text-center">
                  <span className={`${styles.statusBadge} ${getStatusClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="text-end text-muted">{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateTicketModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onCreate={handleCreateTicket} 
      />
    </div>
  );
};

export default TicketList;