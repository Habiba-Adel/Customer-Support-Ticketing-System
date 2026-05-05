import { useState, useEffect } from "react";
import styles from "./TicketList.module.css";
import CreateTicketModal from "./CreateTicketModal"; // Import the modal
import { getTickets } from "../../api";

const TicketList = () => {
  const [showModal, setShowModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // setLoading(true);

        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

const handleCreateTicket = (newTicket) => {
  setTickets([newTicket, ...tickets]);
};

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return styles.statusOpen;
      case "In Progress":
        return styles.statusInProgress;
      case "Closed":
        return styles.statusClosed;
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
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
          style={{ backgroundColor: "#0052cc" }}
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
              <th scope="col" className="text-center">
                Status
              </th>
              <th scope="col" className="text-end">
                Created Date
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td className="text-center">
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(ticket.status)}`}
                  >
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
