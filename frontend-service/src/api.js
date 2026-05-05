const BASE = '';  // empty because nginx proxies /api/* to the right service

const getToken = () => localStorage.getItem('token');
const getUser  = () => JSON.parse(localStorage.getItem('user') || '{}');

const headers = (auth = false) => ({
  'Content-Type': 'application/json',
  ...(auth && { Authorization: `Bearer ${getToken()}` })
});

// ── USER SERVICE ──────────────────────────────────────────────
export const registerUser = (data) =>
  fetch(`${BASE}/api/users/register`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const loginUser = (data) =>
  fetch(`${BASE}/api/users/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

// ── TICKET SERVICE ────────────────────────────────────────────
export const getTickets = () =>
  fetch(`${BASE}/api/tickets`, { headers: headers() }).then(r => r.json());

export const createTicket = (data) =>
  fetch(`${BASE}/api/tickets`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());


export const getTicketById = (id) =>fetch(`${BASE}/api/tickets/${id}`, {headers: headers(true)}).then(r => r.json());


// ── SUPPORT SERVICE ───────────────────────────────────────────
export const assignAgent = (ticketId, agentId) =>
  fetch(`${BASE}/api/support/assign`, { method: 'POST', headers: headers(), body: JSON.stringify({ ticketId, agentId }) }).then(r => r.json());

export const resolveTicket = (ticketId) =>
  fetch(`${BASE}/api/support/resolve/${ticketId}`, { method: 'PUT', headers: headers() }).then(r => r.json());

export const closeTicket = (ticketId) =>
  fetch(`${BASE}/api/support/close/${ticketId}`, { method: 'PUT', headers: headers() }).then(r => r.json());

export const addResponse = (ticketId, sender, message) =>
  fetch(`${BASE}/api/support/respond`, { method: 'POST', headers: headers(), body: JSON.stringify({ ticketId, sender, message }) }).then(r => r.json());

export const getSupportTicket = (ticketId) =>
  fetch(`${BASE}/api/support/${ticketId}`, {
    headers: headers(true)
  }).then(r => r.json());

export const reopenTicket = (ticketId) =>
  fetch(`${BASE}/api/support/reopen/${ticketId}`, {
    method: 'PUT',
    headers: headers(true)
  }).then(r => r.json());

// ── NOTIFICATION SERVICE ──────────────────────────────────────
export const getNotifications = (userId) =>
  fetch(`${BASE}/api/notifications/${userId}`, { headers: headers() }).then(r => r.json());

export const markAsRead = (id) =>
  fetch(`${BASE}/api/notifications/${id}/read`, { method: 'PATCH', headers: headers() }).then(r => r.json());

export const markAllRead = (userId) =>
  fetch(`${BASE}/api/notifications/read-all/${userId}`, { method: 'PATCH', headers: headers() }).then(r => r.json());

export const getUnreadCount = (userId) =>
  fetch(`${BASE}/api/notifications/unread-count/${userId}`, { headers: headers() }).then(r => r.json());

export const deleteNotification = (id) =>
  fetch(`${BASE}/api/notifications/${id}`, {
    method: 'DELETE',
    headers: headers(true)
  }).then(r => r.json());

export const clearAllNotifications = (userId) =>
  fetch(`${BASE}/api/notifications/clear-all/${userId}`, {
    method: 'DELETE',
    headers: headers(true)
  }).then(r => r.json());
  
// ── REPORTING SERVICE ─────────────────────────────────────────
export const getTotalTickets    = () => fetch(`${BASE}/api/reports/total-tickets`,    { headers: headers() }).then(r => r.json());
export const getStatusCounts    = () => fetch(`${BASE}/api/reports/status-counts`,    { headers: headers() }).then(r => r.json());
export const getPriorityCounts  = () => fetch(`${BASE}/api/reports/priority-counts`,  { headers: headers() }).then(r => r.json());
export const getAvgResolution   = () => fetch(`${BASE}/api/reports/average-resolution`,{ headers: headers() }).then(r => r.json());
export const getAgentPerformance= () => fetch(`${BASE}/api/reports/agent-performance`,{ headers: headers() }).then(r => r.json());



