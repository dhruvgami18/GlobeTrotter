import api from './api';

export const cityService = {
  async getCities(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/cities${query ? `?${query}` : ''}`);
  },

  async getCityById(id) {
    return api.get(`/cities/${id}`);
  },
};

export default cityService;
