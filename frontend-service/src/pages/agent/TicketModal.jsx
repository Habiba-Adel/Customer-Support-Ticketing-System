// src/pages/agent/Workspace/TicketModal.jsx
import React from 'react';
import styles from './workspace/Workspace.module.css';

export default function TicketModal({ ticket, onClose }) {
  if (!ticket) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4 className="fw-bold mb-1">Ticket #{ticket.id}</h4>
            <p className="text-muted small">{ticket.title}</p>
          </div>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="row g-3 mb-4 bg-light p-3 rounded">
          <div className="col-4"><small className="text-muted d-block">Status</small><span className="badge bg-primary rounded-pill">Open</span></div>
          <div className="col-4"><small className="text-muted d-block">Priority</small><span className="badge bg-secondary rounded-pill">{ticket.priority}</span></div>
          <div className="col-4"><small className="text-muted d-block">Created By</small><span className="fw-bold">{ticket.customer}</span></div>
        </div>

        <h6 className="fw-bold mb-3">Interaction History</h6>
        <div className="mb-4">
          <div className={styles.chatBubble}>
            <small className="fw-bold d-block">{ticket.customer}</small>
            <p className="mb-0">I am facing an issue with {ticket.title}.</p>
          </div>
          <div className={`${styles.chatBubble} ${styles.agentBubble}`}>
            <small className="fw-bold d-block">Hend (Agent)</small>
            <p className="mb-0">Looking into this for you right now!</p>
          </div>
        </div>

        <div className="d-flex gap-2">
          <input type="text" className="form-control" placeholder="Type your response..." />
          <button className="btn btn-dark px-4" onClick={onClose}>Send</button>
        </div>
      </div>
    </div>
  );
}