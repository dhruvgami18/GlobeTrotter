import api from './api';

export const communityService = {
  /**
   * Get public community itineraries with filters and search
   */
  getCommunityTrips: async (params = {}) => {
    return api.get('/community/trips', { params });
  },

  /**
   * Get a public trip by its share token (read-only)
   */
  getPublicTrip: async (shareToken) => {
    return api.get(`/public/trips/${shareToken}`);
  },

  /**
   * Deep-copy a public trip into the logged in user's account
   */
  copyPublicTrip: async (shareToken) => {
    return api.post(`/public/trips/${shareToken}/copy`);
  },

  /**
   * Publish a trip to make it public & generate shareToken
   */
  publishTrip: async (tripId) => {
    return api.post(`/trips/${tripId}/publish`);
  },

  /**
   * Unpublish a trip to make it private again
   */
  unpublishTrip: async (tripId) => {
    return api.post(`/trips/${tripId}/unpublish`);
  },
};

export default communityService;
