import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      // API call to send OTP
      const response = await api.post('/send-otp', { email });
      if (response.status === 200) {
        alert("OTP sent to your email!");
        navigate('/verify', { state: { email } });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(error.response?.data?.message || "Failed to send OTP. Please try again.");
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
          <h2 className="text-2xl font-bold text-slate-800">Forgot password?</h2>
          <p className="text-slate-500 mt-2">Select which contact details should we use to reset your password</p>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {/* Contact Option Card */}
          <div className="flex items-center p-4 border-2 border-emerald-500 bg-emerald-50 rounded-2xl cursor-pointer">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mr-4">
              📧
            </div>
            <div>
              <p className="text-xs text-slate-500">Via email:</p>
              <input
                type="email"
                placeholder="email@gmail.com"
                className="bg-transparent font-medium focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-600 transition-all"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;