import api from './api';

export const activityService = {
  /**
   * Search & filter activities
   * @param {Object} params - { cityId, search, category, maxCost, maxDuration, minRating, sortBy }
   */
  async getActivities(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'ALL') {
        queryParams.append(key, value);
      }
    });
    return api.get(`/activities?${queryParams.toString()}`);
  },

  /**
   * Get single activity by ID
   */
  async getActivityById(id) {
    return api.get(`/activities/${id}`);
  },
};

export default activityService;
