import styles from './TicketDetailsModal.module.css';

export default function TicketDetailModal({ ticket, onClose }) {
  if (!ticket) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className="d-flex justify-content-between mb-4">
          <h5 className="fw-bold">Ticket #{ticket.id} Details</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* Status & Priority (View Only) */}
        <div className="row mb-4 bg-light p-3 rounded">
          <div className="col-6">
            <small className="text-muted d-block">Status</small>
            <span className="badge rounded-pill" style={{ backgroundColor: 'var(--open-status)' }}>{ticket.status}</span>
          </div>
          <div className="col-6">
            <small className="text-muted d-block">Priority</small>
            <span className="badge bg-danger">{ticket.priority}</span>
          </div>
        </div>

        {/* Interaction History */}
        <div className={styles.historyBox}>
          <p className="small text-muted mb-2 text-center">--- Interaction History ---</p>
          {/* Render messages here */}
          <div className={styles.message}>
            <strong>{ticket.customer}:</strong> {ticket.title}
          </div>
        </div>

        <div className="mt-4 pt-3 border-top">
          {ticket.isReadOnly ? (
            <button className="btn btn-secondary w-100" onClick={onClose}>Close View</button>
          ) : (
            <div className="d-flex gap-2">
              <input type="text" className="form-control" placeholder="Type resolution..." />
              <button className={styles.resolveBtn}>Resolve</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}