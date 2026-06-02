import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

interface AuthResponse {
  token: string;
  type: string;
  user: {
    id: number;
    username: string;
    email: string;
    sectionId: number;
    sectionLibelle: string;
    roles: string[];
  };
}

class ApiClient {
  private api: AxiosInstance;
  private token: string | null = localStorage.getItem('token');

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (this.token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  setToken(token: string) {
    this.token = token;
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    delete this.api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }

  // Auth endpoints
  login(username: string, password: string) {
    return this.api.post<AuthResponse>('/auth/login', { username, password });
  }

  // Section endpoints
  getSections() {
    return this.api.get('/sections');
  }

  getSectionById(id: number) {
    return this.api.get(`/sections/${id}`);
  }

  // Programme endpoints
  getProgrammes() {
    return this.api.get('/programmes');
  }

  getProgrammesBySection(sectionId: number) {
    return this.api.get(`/programmes/section/${sectionId}`);
  }

  // Action endpoints
  getActionsByProgramme(programmeId: number) {
    return this.api.get(`/actions/programme/${programmeId}`);
  }

  // Activite endpoints
  getActivitiesByAction(actionId: number) {
    return this.api.get(`/activites/action/${actionId}`);
  }

  // Transaction endpoints
  getTransactionsBySection(sectionId: number) {
    return this.api.get(`/transactions/section/${sectionId}`);
  }

  createTransaction(transaction: any) {
    return this.api.post('/transactions', transaction);
  }

  transmitTransaction(id: number) {
    return this.api.post(`/transactions/${id}/transmit`, {});
  }

  validateTransaction(id: number) {
    return this.api.post(`/transactions/${id}/validate`, {});
  }

  rejectTransaction(id: number) {
    return this.api.post(`/transactions/${id}/reject`, {});
  }
}

export default new ApiClient();
