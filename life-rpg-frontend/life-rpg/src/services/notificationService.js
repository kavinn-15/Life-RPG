// Production notification service wired to Spring Boot backend.
// Manages alerts, read states, unread counts, and session notifications.

import { api } from './apiClient';

// GET /api/notifications
export async function getNotifications() {
  return api.get('/notifications');
}

// PATCH or POST /api/notifications/:id/read
export async function markAsRead(id) {
  return api.patch(`/notifications/${id}/read`);
}

// POST /api/notifications/read-all
export async function markAllAsRead() {
  return api.post('/notifications/read-all');
}

// DELETE /api/notifications
export async function clearAll() {
  return api.delete('/notifications');
}

// POST /api/notifications
export async function addNotification(data) {
  return api.post('/notifications', data);
}

// GET /api/notifications/unread-count
export async function getUnreadCount() {
  return api.get('/notifications/unread-count');
}

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAll,
  addNotification,
  getUnreadCount,
};
