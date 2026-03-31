import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const NewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const location = useLocation();
  const email = location.state?.email;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await api.post('/reset-password', {
        email,
        password: passwords.new,
        password_confirmation: passwords.confirm
      });

      if (response.status === 200) {
        alert("Password updated successfully!");
        navigate('/login');
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      alert(error.response?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">

        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="p-2 bg-emerald-50 rounded-lg text-emerald-600 mb-6">
            ←
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Reset your password here</h2>
          <p className="text-slate-500 mt-2 text-sm">
            Select which contact details should we use to reset your password
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-600 transition-all"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;