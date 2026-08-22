import api from './api';

export const itineraryService = {
  /**
   * Get trip itinerary with stops and items
   */
  async getTripItinerary(tripId) {
    return api.get(`/trips/${tripId}/itinerary`);
  },

  /**
   * Add activity to trip itinerary
   */
  async addItineraryItem(tripId, data) {
    return api.post(`/trips/${tripId}/itinerary`, data);
  },

  /**
   * Update an existing itinerary item (date, time, notes, custom cost)
   */
  async updateItineraryItem(id, data) {
    return api.put(`/itinerary/${id}`, data);
  },

  /**
   * Delete an itinerary item
   */
  async deleteItineraryItem(id) {
    return api.delete(`/itinerary/${id}`);
  },

  /**
   * Reorder items within a trip
   * @param {number} tripId
   * @param {Array<{ id: number, sortOrder: number, date?: string }>} items
   */
  async reorderItinerary(tripId, items) {
    return api.put(`/trips/${tripId}/itinerary/reorder`, { items });
  },
};

export default itineraryService;
