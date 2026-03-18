import axios from 'axios';
import { AuthResponse, User, Attendance, AttendanceStats } from '../types';

// Use deployed backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://hospital-attendence-2.onrender.com/api';

console.log('API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error); // Debug log
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string, role: string) =>
    api.post<AuthResponse>('/auth/register', { name, email, password, role }),
};

// User API
export const userAPI = {
  getAllUsers: () => api.get<User[]>('/users'),
  getStaff: () => api.get<User[]>('/users/staff'),
  createStaff: (data: { name: string; email: string; password: string; department: string }) =>
    api.post<{ message: string; user: User }>('/users/create-staff', data),
  updateUser: (id: string, data: Partial<User>) =>
    api.put<{ message: string; user: User }>(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

// Attendance API
export const attendanceAPI = {
  checkIn: () => api.post<{ message: string; attendance: Attendance }>('/attendance/checkin'),
  checkOut: () => api.post<{ message: string; attendance: Attendance }>('/attendance/checkout'),
  getMyAttendance: () => api.get<Attendance[]>('/attendance/my'),
  getTodayStatus: () => api.get<{ hasCheckedIn: boolean; hasCheckedOut: boolean; attendance?: Attendance }>('/attendance/today'),
  getAllAttendance: () => api.get<Attendance[]>('/attendance/all'),
  getAttendanceByRange: (startDate: string, endDate: string) =>
    api.get<Attendance[]>(`/attendance/range?startDate=${startDate}&endDate=${endDate}`),
  getStats: () => api.get<AttendanceStats>('/attendance/stats'),
  markAbsent: (userId: string, date: string) =>
    api.post<{ message: string; attendance: Attendance }>('/attendance/mark-absent', { userId, date }),
};

export default api;