// client/src/pages/Profile.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-[#6366f1]/30">
        <h1 className="text-3xl font-bold text-white mb-4">Profile</h1>
        {user ? (
          <div>
            <p className="text-gray-300">Name: {user.name}</p>
            <p className="text-gray-300">Email: {user.email}</p>
          </div>
        ) : (
          <p className="text-gray-300">No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;