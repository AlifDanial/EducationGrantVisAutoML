import axios from 'axios';
import { addInstanceIdToRequest } from '../utils/instanceManager';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const DASH_BASE_URL = process.env.REACT_APP_DASH_URL || 'http://localhost:8050';

// Create axios instances
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

const dashClient = axios.create({
    baseURL: DASH_BASE_URL,
    timeout: 30000,
});

// Add request interceptors
[apiClient, dashClient].forEach(client => {
    client.interceptors.request.use(
        addInstanceIdToRequest,
        error => Promise.reject(error)
    );
});

// Add response interceptors for error handling
const handleResponseError = error => {
    if (error.response) {
        // Server responded with error status
        console.error('API Error:', error.response.data);
        throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
        // Request made but no response
        console.error('Network Error:', error.request);
        throw new Error('Network error - please check your connection');
    } else {
        // Error in request setup
        console.error('Request Error:', error.message);
        throw error;
    }
};

[apiClient, dashClient].forEach(client => {
    client.interceptors.response.use(
        response => response,
        handleResponseError
    );
});

// API functions
export const api = {
    // Model endpoints
    async getModels() {
        const response = await apiClient.get('/api/');
        return response.data;
    },

    async createModel(formData) {
        const response = await apiClient.post('/api/', formData);
        return response.data;
    },

    async deleteModel(id) {
        const response = await apiClient.delete(`/api/${id}/`);
        return response.data;
    },

    async updateModelDescription(id, data) {
        const response = await apiClient.patch(`/api/description/${id}/`, data);
        return response.data;
    },

    // Flask/Dash endpoints
    async createFlaskModel(data) {
        const response = await apiClient.post('/api/flask/', data);
        return response.data;
    },

    async getFlaskModels() {
        const response = await apiClient.get('/api/table/');
        return response.data;
    },

    async openDashboard(id) {
        const response = await apiClient.post(`/api/dashboard/${id}/`);
        return response.data;
    },

    // Health check
    async checkHealth() {
        const response = await apiClient.get('/health/');
        return response.data;
    }
};

export const dashApi = {
    // Add Dash-specific API endpoints here
    async getDashboardData(modelId) {
        const response = await dashClient.get(`/data/${modelId}`);
        return response.data;
    }
}; 