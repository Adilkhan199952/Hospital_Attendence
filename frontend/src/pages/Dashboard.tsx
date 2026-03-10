import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceAPI } from '../services/api';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [todayStatus, setTodayStatus] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodayStatus();
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchTodayStatus = async () => {
    try {
      const response = await attendanceAPI.getTodayStatus();
      setTodayStatus(response.data);
    } catch (error) {
      console.error('Error fetching today status:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await attendanceAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await attendanceAPI.checkIn();
      fetchTodayStatus();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await attendanceAPI.checkOut();
      fetchTodayStatus();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString();
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Staff Dashboard */}
      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Check-in/Check-out Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Today's Attendance</h2>
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              <div className="text-2xl font-bold text-gray-900">
                {getCurrentTime()}
              </div>
              
              {todayStatus && (
                <div className="space-y-2">
                  {todayStatus.hasCheckedIn ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>Checked in at {todayStatus.attendance?.checkIn}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      <span>Not checked in yet</span>
                    </div>
                  )}
                  
                  {todayStatus.hasCheckedOut && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>Checked out at {todayStatus.attendance?.checkOut}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex space-x-3">
                {!todayStatus?.hasCheckedIn ? (
                  <button
                    onClick={handleCheckIn}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Checking in...' : 'Check In'}
                  </button>
                ) : !todayStatus?.hasCheckedOut ? (
                  <button
                    onClick={handleCheckOut}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Checking out...' : 'Check Out'}
                  </button>
                ) : (
                  <div className="flex-1 bg-gray-100 text-gray-600 font-medium py-2 px-4 rounded-md text-center">
                    Day Complete
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
            {todayStatus?.attendance && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    todayStatus.attendance.status === 'present' ? 'text-green-600' :
                    todayStatus.attendance.status === 'late' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {todayStatus.attendance.status.charAt(0).toUpperCase() + 
                     todayStatus.attendance.status.slice(1)}
                  </span>
                </div>
                {todayStatus.attendance.workingHours > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Working Hours:</span>
                    <span className="font-medium">{todayStatus.attendance.workingHours}h</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {isAdmin && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStaff}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-2xl font-bold text-red-600">{stats.absentToday}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late Today</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lateToday}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;