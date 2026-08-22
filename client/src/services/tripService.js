import api from './api';

export const tripService = {
  async getTrips() {
    return api.get('/trips');
  },

  async getTripById(id) {
    return api.get(`/trips/${id}`);
  },

  async createTrip(data) {
    return api.post('/trips', data);
  },
};

export default tripService;
