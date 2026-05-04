import{ useState, useEffect } from 'react';
import styles from './Notifications.module.css';

//TO DO : CHANGE READ STATUS ON CLICK --IMPORTANT
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600));

        const apiData = [
          {
            id: 1,
            title: "Ticket Updated",
            message: "Your ticket #1 status changed to In Progress",
            time: "2 hours ago",
            read: false,
            
          },
          {
            id: 2,
            title: "Ticket Resolved",
            message: "Your ticket #7 has been resolved",
            time: "1 day ago",
            read: true,
            
          }
        ];

        setNotifications(apiData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading notifications...</span>
          </div>
        </div>
      </div>
    );
  }
console.table(notifications);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className="fw-bold">Notifications</h2>
        {unreadCount > 0 && (
          <div className={styles.unreadBadge}>
            {unreadCount} unread
          </div>
        )}
      </div>

      <div className="d-flex flex-column">
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <div 
              key={note.id} 
              className={`${styles.notificationItem} ${!note.read ? styles.unreadItem : ''}`}
            >
              <div className={styles.iconContainer}>
                <i className={`bi bi-ticket-perforated fs-5`}></i>
              </div>

              <div className={styles.content}>
                <div className={styles.title}>{note.title}</div>
                <p className={styles.message}>{note.message}</p>
              </div>

              <div className={styles.time}>{note.time}</div>
            </div>
          ))
        ) : (
          <div className="text-center mt-5 text-muted">
            <i className="bi bi-bell-slash fs-1 d-block mb-2"></i>
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;