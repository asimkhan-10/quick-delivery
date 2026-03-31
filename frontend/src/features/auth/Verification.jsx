import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const Verification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      alert("Please enter a complete 4-digit code");
      return;
    }

    try {
      const response = await api.post('/verify-otp', {
        email,
        otp: otpCode
      });

      if (response.status === 200) {
        // Navigate to new password screen with email
        navigate('/new-password', { state: { email } });
      }
    } catch (error) {
      console.error("Verification failed:", error);
      alert(error.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">

        <h2 className="text-2xl font-bold text-slate-800 mb-2">Enter 4-digit Verification code</h2>
        <div className="flex justify-center gap-4 mb-8">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-16 h-16 text-2xl font-bold bg-slate-50 border border-slate-200 rounded-2xl text-center focus:border-emerald-500 focus:outline-none"
              value={data}
              onChange={e => handleChange(e.target, index)}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-600 transition-all"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default Verification;