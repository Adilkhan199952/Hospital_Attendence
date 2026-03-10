import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../../services/api';
import { AttendanceStats } from '../../types';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

const Reports: React.FC = () => {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await attendanceAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Reports</h1>
          <p className="text-gray-600">Unable to load statistics.</p>
        </div>
      </div>
    );
  }

  const attendanceRate = stats.totalStaff > 0 ? 
    Math.round((stats.presentToday / stats.totalStaff) * 100) : 0;

  const punctualityRate = stats.presentToday > 0 ? 
    Math.round(((stats.presentToday - stats.lateToday) / stats.presentToday) * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStaff}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-3xl font-bold text-green-600">{stats.presentToday}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-blue-600">{attendanceRate}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Punctuality Rate</p>
              <p className="text-3xl font-bold text-purple-600">{punctualityRate}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Staff:</span>
              <span className="font-semibold text-gray-900">{stats.totalStaff}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Present:</span>
              <span className="font-semibold text-green-600">{stats.presentToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Absent:</span>
              <span className="font-semibold text-red-600">{stats.absentToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Late Arrivals:</span>
              <span className="font-semibold text-yellow-600">{stats.lateToday}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Attendance Rate:</span>
                <span className="font-semibold text-blue-600">{attendanceRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Check-ins This Month:</span>
              <span className="font-semibold text-gray-900">{stats.monthlyAttendance}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Daily Attendance:</span>
              <span className="font-semibold text-blue-600">
                {Math.round(stats.monthlyAttendance / new Date().getDate())}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Punctuality Rate:</span>
              <span className="font-semibold text-purple-600">{punctualityRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              attendanceRate >= 90 ? 'text-green-600' : 
              attendanceRate >= 75 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {attendanceRate >= 90 ? '🟢' : attendanceRate >= 75 ? '🟡' : '🔴'}
            </div>
            <h3 className="font-semibold text-gray-900">Attendance</h3>
            <p className="text-sm text-gray-600">
              {attendanceRate >= 90 ? 'Excellent' : 
               attendanceRate >= 75 ? 'Good' : 'Needs Improvement'}
            </p>
          </div>

          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              punctualityRate >= 85 ? 'text-green-600' : 
              punctualityRate >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {punctualityRate >= 85 ? '🟢' : punctualityRate >= 70 ? '🟡' : '🔴'}
            </div>
            <h3 className="font-semibold text-gray-900">Punctuality</h3>
            <p className="text-sm text-gray-600">
              {punctualityRate >= 85 ? 'Excellent' : 
               punctualityRate >= 70 ? 'Good' : 'Needs Improvement'}
            </p>
          </div>

          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              stats.absentToday === 0 ? 'text-green-600' : 
              stats.absentToday <= 2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {stats.absentToday === 0 ? '🟢' : 
               stats.absentToday <= 2 ? '🟡' : '🔴'}
            </div>
            <h3 className="font-semibold text-gray-900">Absenteeism</h3>
            <p className="text-sm text-gray-600">
              {stats.absentToday === 0 ? 'Perfect' : 
               stats.absentToday <= 2 ? 'Acceptable' : 'High'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;