import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
// const API_URL = "http://162.0.237.160:4522/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});


export default api;

export const CriminalRecordsService = {

  getAllRecords: async (searchTerm = '') => {
    try {
      const params: { search?: string } = {};
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await api.get('/records/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  },

  getRecordStats: async () => {
    try {
      const response = await api.get('/records/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching record stats:', error);
      throw error;
    }
  },

  generateRecord: async (citizenId) => {
    try {
      // This would be your endpoint to generate a new record
      const response = await api.post('/records/generate/', { citizen_id: citizenId });
      return response.data;
    } catch (error) {
      console.error('Error generating record:', error);
      throw error;
    }
  }

};
