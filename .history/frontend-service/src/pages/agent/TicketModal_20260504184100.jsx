import styles from './workspace/Workspace.module.css';

export default function TicketModal({ ticket, onClose }) {
  if (!ticket) return null;

<<<<<<< HEAD
=======

>>>>>>> frontend
  const isReadOnly = ticket.isReadOnly || ticket.status === "Closed";

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return { backgroundColor: 'var(--urgent-error-status)' };
      case 'Medium': return { backgroundColor: 'var(--in-progress-status)' };
      case 'Low': return { backgroundColor: 'var(--open-status)' };
      default: return {};
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
<<<<<<< HEAD
=======
        {/* Header */}
>>>>>>> frontend
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4 className="fw-bold mb-1">Ticket #{ticket.id}</h4>
            <p className="text-muted small">{ticket.title}</p>
          </div>
          <button className="btn-close" onClick={onClose}></button>
        </div>

<<<<<<< HEAD
=======
        {/* Info Grid */}
>>>>>>> frontend
        <div className="row g-3 mb-4 bg-light p-3 rounded mx-0">
          <div className="col-4">
            <small className="text-muted d-block">Status</small>
            <span
              className="badge rounded-pill px-3"
              style={{ backgroundColor: ticket.status === 'Closed' ? 'var(--closed-status)' : 'var(--in-progress-status)' }}
            >
              {ticket.status}
            </span>
          </div>
          <div className="col-4">
            <small className="text-muted d-block">Priority</small>
            <span className="badge rounded-pill px-3" style={getPriorityStyle(ticket.priority)}>
              {ticket.priority}
            </span>
          </div>
          <div className="col-4">
            <small className="text-muted d-block">Created By</small>
            <span className="fw-bold">{ticket.customer}</span>
          </div>
        </div>

<<<<<<< HEAD
=======
        {/* History */}
>>>>>>> frontend
        <h6 className="fw-bold mb-3">Interaction History</h6>
        <div className="mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <div className={styles.chatBubble}>
            <small className="fw-bold d-block">{ticket.customer}</small>
            <p className="mb-0 small text-dark">I am facing an issue with {ticket.title}.</p>
          </div>
          <div className={`${styles.chatBubble} ${styles.agentBubble}`}>
            <small className="fw-bold d-block">Hend (Agent)</small>
            <p className="mb-0 small text-dark">Looking into this for you right now!</p>
          </div>
        </div>

<<<<<<< HEAD
=======
        {/* Footer:Conditional Rendering based on isReadOnly */}
>>>>>>> frontend
        {!isReadOnly ? (
          <div className="d-flex gap-2 pt-3 border-top">
            <input
              type="text"
              className="form-control"
              placeholder="Type your response..."
            />
            <button className="btn btn-dark px-4" onClick={onClose}>Send</button>
          </div>
        ) : (
          <div className="pt-3 border-top text-center">
            <p className="text-muted small italic">
              This ticket is <strong>Closed</strong>. Response is disabled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> frontend
