import React from 'react';
import styles from './Reports/Reports.module.css';

export default function StatRow({ label, count, total, color }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="d-flex align-items-center mb-3">
      <div style={{ width: '100px' }} className="small fw-semibold text-dark">{label}</div>
      <div className="flex-grow-1 mx-3">
        <div className={styles.progressBarContainer}>
          <div
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              height: '100%',
              borderRadius: '10px'
            }}
          ></div>
        </div>
      </div>
      <div className="small fw-bold text-muted" style={{ width: '20px' }}>{count}</div>
    </div>
  );
}