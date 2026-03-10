export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  department: string;
}

export interface Attendance {
  _id: string;
  userId: User | string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late';
  workingHours: number;
  notes?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface AttendanceStats {
  totalStaff: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  monthlyAttendance: number;
}