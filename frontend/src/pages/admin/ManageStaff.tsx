import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { User } from '../../types';
import { Users, Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageStaff: React.FC = () => {
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await userAPI.getStaff();
      setStaff(response.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaff([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await userAPI.deleteUser(id);
        setStaff(staff.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleUpdate = async (user: User) => {
    try {
      await userAPI.updateUser(user.id, {
        name: user.name,
        email: user.email,
        department: user.department,
      });
      setStaff(staff.map(s => s.id === user.id ? user : s));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Manage Staff</h1>
        </div>
        <Link
          to="/admin/add-staff"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Staff</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff && staff.length > 0 ? staff.map((member) => {
                if (!member) return null; // Skip null members
                
                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === member.id ? (
                        <input
                          type="text"
                          value={editingUser.name || ''}
                          onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{member.name || 'N/A'}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === member.id ? (
                        <input
                          type="email"
                          value={editingUser.email || ''}
                          onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{member.email || 'N/A'}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === member.id ? (
                        <input
                          type="text"
                          value={editingUser.department || ''}
                          onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{member.department || 'N/A'}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingUser?.id === member.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(editingUser)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingUser(member)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No staff members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStaff;