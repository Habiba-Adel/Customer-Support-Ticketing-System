import styles from './workspace/Workspace.module.css';
import { addResponse, resolveTicket } from "../../api";
import React, { useEffect, useState } from 'react';

export default function TicketModal({ ticket, onClose, onRefresh }) {
  const [response, setResponse] = useState('');
  if (!ticket) return null;

  const isReadOnly = ticket.isReadOnly || ticket.status === "Closed";

  // useEffect(() => {
  //   const fetchHistory = async () => {
  //     try {
  //       const data = await getSupportTicket(ticket._id || ticket.id);
  //       
  //       setHistory(data.interactions || []);
  //     } catch (err) {
  //       console.error("Could not load history", err);
  //     }
  //   };

  //   if (ticket) fetchHistory();
  // }, [ticket]);

  const handleSendResponse = async () => {
    if (!response.trim()) return;
    try {
      await addResponse(ticket._id || ticket.id, 'Hend (Agent)', response);
      setResponse('');
      // Refresh the workspace data
      onRefresh();
    } catch (err) {
      alert("Failed to send message");
    }
  };

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
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4 className="fw-bold mb-1">Ticket #{ticket.id}</h4>
            <p className="text-muted small">{ticket.title}</p>
          </div>
          <button className="btn-close" onClick={onClose}></button>
        </div>

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

        {/* <h6 className="fw-bold mb-3">Interaction History</h6>
        <div className="mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <div className={styles.chatBubble}>
            <small className="fw-bold d-block">{ticket.customer}</small>
            <p className="mb-0 small text-dark">I am facing an issue with {ticket.title}.</p>
          </div>
          <div className={`${styles.chatBubble} ${styles.agentBubble}`}>
            <small className="fw-bold d-block">Hend (Agent)</small>
            <p className="mb-0 small text-dark">Looking into this for you right now!</p>
          </div>
        </div> */}

        {/* Keeping UI good while history API is uncertain */}
        <h6 className="fw-bold mb-3">Description</h6>
        <div className="mb-4 p-3 border rounded bg-white">
          <p className="mb-0 small text-dark">
            {ticket.description || "No detailed description provided."}
          </p>
        </div>

        {!isReadOnly ? (
          <div className="d-flex gap-2 pt-3 border-top">
            <input
              type="text"
              className="form-control"
              placeholder="Type your response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)} // Update state on change
            />
            <button
              className="btn btn-dark px-4"
              onClick={handleSendResponse} // Trigger API call
            >
              Send
            </button>
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
}