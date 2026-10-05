import axios from 'axios';

// Default to relative '/api/v1' which is proxied by Vite dev server to FastAPI,
// or fallback to direct FastAPI port 8000
const API_BASE = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchStations = () => apiClient.get('/stations');
export const fetchTrains = () => apiClient.get('/trains');
export const fetchTrainETA = (trainNumber) => apiClient.get(`/eta/${trainNumber}`);
export const fetchAllETAs = () => apiClient.get('/eta');
export const fetchPropagation = (trainNumber) => apiClient.get(`/propagation/${trainNumber}`);
export const fetchDisruptions = () => apiClient.get('/disruptions');
export const toggleDisruption = (id) => apiClient.patch(`/disruptions/${id}/toggle`);
export const simulateRecovery = () => apiClient.get('/recovery/simulate');
export const approveRecovery = (optionId) => apiClient.post(`/recovery/approve/${optionId}`);
export const updateTrainStatus = (trainNumber, params) => apiClient.post(`/trains/${trainNumber}/update`, null, { params });

export default apiClient;
