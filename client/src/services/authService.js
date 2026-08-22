import api from './api';

export const authService = {
  // Authentication
  async register(data) {
    return api.post('/auth/register', data);
  },

  async login(email, password) {
    return api.post('/auth/login', { email, password });
  },

  async getMe() {
    return api.get('/auth/me');
  },

  // Profile Management
  async getProfile() {
    return api.get('/profile');
  },

  async updateProfile(data) {
    return api.put('/profile', data);
  },

  async deleteAccount() {
    return api.delete('/profile');
  },

  // Saved Destinations
  async getSavedDestinations() {
    return api.get('/profile/saved-destinations');
  },

  async addSavedDestination(cityId) {
    return api.post('/profile/saved-destinations', { cityId });
  },

  async removeSavedDestination(cityId) {
    return api.delete(`/profile/saved-destinations/${cityId}`);
  },
};

export default authService;
