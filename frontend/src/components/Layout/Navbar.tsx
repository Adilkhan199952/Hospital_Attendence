import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Calendar } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl">Hospital Attendance</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span className="font-medium">{user?.name}</span>
              <span className="text-blue-200 text-sm">
                ({isAdmin ? 'Admin' : 'Staff'})
              </span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;