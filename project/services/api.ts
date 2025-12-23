import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = __DEV__
  ? 'http://192.168.100.7:8000/api'
  : 'https://api.assistancekmy.com/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    const response = await this.client.post('/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async logout() {
    await this.client.post('/logout');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  }

  async getCurrentUser() {
    const response = await this.client.get('/user');
    return response.data;
  }

  async forgotPassword(email: string) {
    return this.client.post('/forgot-password', { email });
  }

  async resetPassword(data: { email: string; token: string; password: string; password_confirmation: string }) {
    return this.client.post('/reset-password', data);
  }

  // Emergency requests
  async createAnonymousRequest(data: {
    prenom: string;
    nom: string;
    telephone: string;
    adresse: string;
    latitude?: number;
    longitude?: number;
  }) {
    const response = await this.client.post('/demande-anonyme', data);
    return response.data;
  }

  async createAuthenticatedRequest(data: {
    latitude?: number;
    longitude?: number;
  }) {
    const response = await this.client.post('/demande', data);
    return response.data;
  }

  async getRequests(status?: string) {
    const url = status ? `/demandes?status=${status}` : '/demandes';
    const response = await this.client.get(url);
    return response.data;
  }

  async getRequestById(id: string) {
    const response = await this.client.get(`/demandes/${id}`);
    return response.data;
  }

  async updateRequestStatus(id: string, status: string) {
    const response = await this.client.patch(`/demandes/${id}/status`, { status });
    return response.data;
  }

  async deleteRequest(id: string) {
    await this.client.delete(`/demandes/${id}`);
  }

  getBaseUrl() {
    return API_URL;
  }
}

export const apiClient = new ApiClient();
