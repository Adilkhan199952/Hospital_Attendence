import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Clock, 
  Users, 
  BarChart3, 
  UserPlus,
  Calendar
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/attendance', icon: Clock, label: 'My Attendance' },
  ];

  const adminItems = [
    { to: '/admin/staff', icon: Users, label: 'Manage Staff' },
    { to: '/admin/attendance', icon: Calendar, label: 'All Attendance' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { to: '/admin/add-staff', icon: UserPlus, label: 'Add Staff' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        {isAdmin && (
          <>
            <div className="border-t border-gray-600 my-4"></div>
            <div className="text-gray-400 text-sm font-medium mb-2">Admin Panel</div>
            {adminItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;