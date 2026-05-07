import React from 'react';
import { useEffect, useState } from 'react';
import styles from './Reports.module.css';
import StatRow from '../StatRow';
import {
  getTotalTickets,
  getStatusCounts,
  getPriorityCounts,
  getAvgResolution
} from '../../../api';

export default function Reports() {
  // const totalTickets = 10;
  const [total, setTotal] = useState(0);
  const [avgTime, setAvgTime] = useState("0 hours");
  const [statusData, setStatusData] = useState({});
  const [priorityData, setPriorityData] = useState({});
  const [loading, setLoading] = useState(true);

  // Get Data From Backend
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const [totalRes, statusRes, priorityRes, avgRes] = await Promise.all([
          getTotalTickets(),
          getStatusCounts(),
          getPriorityCounts(),
          getAvgResolution()
        ]);

        setTotal(totalRes?.totalTickets || 0);

        const statusMap = {};
        if (Array.isArray(statusRes)) {
          statusRes.forEach(item => {
            if (item._id) statusMap[item._id] = item.count;
          });
        } setStatusData(statusMap);

        const priorityMap = {};
        if (Array.isArray(priorityRes)) {
          priorityRes.forEach(item => {
            if (item._id) priorityMap[item._id] = item.count;
          });
        } setPriorityData(priorityMap);

        const avg = avgRes?.averageTimeHours;
        setAvgTime(typeof avg === 'number' ? `${avg.toFixed(1)} hours` : "0 hours");
      } catch (error) {
        console.error("Failed to fetch report data:", error);
        setStatusData({});
        setPriorityData({});
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  if (loading) return <div className="text-center p-5">Loading Analytics...</div>;

  return (
    <div className={styles.reportsContainer}>
      <h3 className={styles.cardTitle + " mb-4"}>Reports & Analytics</h3>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className={`card ${styles.statCard} p-4`}>
            <h2 className={styles.mainValue}>{total}</h2>
            <p className={styles.statLabel + " mb-0"}>Total Tickets</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className={`card ${styles.statCard} p-4`}>
            <h2 className={styles.mainValue}>{avgTime}</h2>
            <p className={styles.statLabel + " mb-0"}>Avg. Resolution Time</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Panel 1: Status */}
        <div className="col-md-6">
          <div className={`card ${styles.statCard} p-4`}>
            <h5 className="fw-bold mb-4">Tickets by Status</h5>
            <StatRow label="Open" count={statusData.Open || 0} total={total} color="var(--open-status)" />
            <StatRow label="In Progress" count={statusData["In Progress"] || 0} total={total} color="var(--in-progress-status)" />
            <StatRow label="Resolved" count={statusData.Resolved || 0} total={total} color="var(--closed-status)" />
            <StatRow label="Closed" count={statusData.Closed || 0} total={total} color="var(--neutral-gray)" />
          </div>
        </div>

        {/* Panel 2: Priority */}
        <div className="col-md-6">
          <div className={`card ${styles.statCard} p-4`}>
            <h5 className="fw-bold mb-4">Tickets by Priority</h5>
            <StatRow label="High" count={priorityData.High || 0} total={total} color="var(--in-progress-status)" />
            <StatRow label="Medium" count={priorityData.Medium || 0} total={total} color="var(--primary-color)" />
            <StatRow label="Low" count={priorityData.Low || 0} total={total} color="var(--neutral-gray)" />
          </div>
        </div>
      </div>
    </div>
  );
}