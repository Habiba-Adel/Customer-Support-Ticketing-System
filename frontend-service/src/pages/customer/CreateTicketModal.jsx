import { useState } from "react";
import styles from "./CreateTicketModal.module.css";
import { createTicket } from "../../api";

const CreateTicketModal = ({ show, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
  });

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createTicket(formData);
      console.log("Ticket created:", response);
      onCreate(response);
      onClose();
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold m-0">Create New Ticket</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className={styles.formLabel}>Title</label>
            <input
              type="text"
              className={`form-control ${styles.customInput}`}
              placeholder="Enter ticket title"
              required
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className={styles.formLabel}>Priority</label>
              <select
                className={`form-select ${styles.customInput}`}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="">Select priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className={styles.formLabel}>Description</label>
            <textarea
              className={`form-control ${styles.customInput}`}
              rows="4"
              placeholder="Detailed description of the issue"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="d-flex gap-3 mt-4">
            <button
              type="button"
              className="btn btn-light flex-grow-1 py-2 fw-semibold"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-grow-1 py-2 fw-semibold"
              style={{ backgroundColor: "#0052cc" }}
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
