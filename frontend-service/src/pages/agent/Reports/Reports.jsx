import React from 'react';
import styles from './Reports.module.css';
import StatRow from '../StatRow';

export default function Reports() {
  const totalTickets = 10;

  return (
    <div className={styles.reportsContainer}>
      <h3 className={styles.cardTitle + " mb-4"}>Reports & Analytics</h3>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className={`card ${styles.statCard} p-4`}>
            <h2 className={styles.mainValue}>{totalTickets}</h2>
            <p className={styles.statLabel + " mb-0"}>Total Tickets</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className={`card ${styles.statCard} p-4`}>
            <h2 className={styles.mainValue}>2.5 hours</h2>
            <p className={styles.statLabel + " mb-0"}>Avg. Resolution Time</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Panel 1: Status */}
        <div className="col-md-6">
          <div className={`card ${styles.statCard} p-4`}>
            <h5 className="fw-bold mb-4">Tickets by Status</h5>
            <StatRow label="Open" count={3} total={totalTickets} color="var(--open-status)" />
            <StatRow label="In Progress" count={3} total={totalTickets} color="var(--in-progress-status)" />
            <StatRow label="Resolved" count={2} total={totalTickets} color="var(--closed-status)" />
            <StatRow label="Closed" count={2} total={totalTickets} color="var(--neutral-gray)" />
          </div>
        </div>

        {/* Panel 2: Priority */}
        <div className="col-md-6">
          <div className={`card ${styles.statCard} p-4`}>
            <h5 className="fw-bold mb-4">Tickets by Priority</h5>
            <StatRow label="High" count={3} total={totalTickets} color="var(--in-progress-status)" />
            <StatRow label="Critical" count={1} total={totalTickets} color="var(--urgent-error-status)" />
            <StatRow label="Medium" count={4} total={totalTickets} color="var(--primary-color)" />
            <StatRow label="Low" count={2} total={totalTickets} color="var(--neutral-gray)" />
          </div>
        </div>
      </div>
    </div>
  );
}