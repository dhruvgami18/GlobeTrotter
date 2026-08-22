import api from './api';

export const adminService = {
  /**
   * Fetch aggregated analytics, popular cities/activities, and engagement stats
   */
  getAdminStats: async () => {
    return api.get('/admin/stats');
  },

  /**
   * Fetch all registered users
   */
  getUsers: async () => {
    return api.get('/admin/users');
  },

  /**
   * Delete a user account (admin only)
   */
  deleteUser: async (userId) => {
    return api.delete(`/admin/users/${userId}`);
  },

  /**
   * Fetch all platform trips
   */
  getTrips: async () => {
    return api.get('/admin/trips');
  },

  /**
   * Delete a trip (admin only)
   */
  deleteTrip: async (tripId) => {
    return api.delete(`/admin/trips/${tripId}`);
  },
};

export default adminService;
