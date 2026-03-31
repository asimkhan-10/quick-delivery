import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', formData);

      // Laravel Sanctum usually returns { token: "...", user: {...} }
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      }
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials. Please try again.";
      alert(message); // Better UX than just a console error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">

        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Quick Delivery" className="w-32 h-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Login To Your Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm px-1">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-600">
              <input type="checkbox" onChange={(e) => setFormData({ ...formData, remember: e.target.checked })} className="accent-emerald-500 w-4 h-4" />
              <span>Keep Me Signed In</span>
            </label>
            {/* <a href="#" className="text-emerald-600 font-medium hover:underline">
              Forgot Your Password?
            </a> */}
            <Link to="/forgot-password" className="text-emerald-600 font-medium hover:underline">Forgot Your Password?</Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-[0.98] transition-all"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-slate-600 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-emerald-600 font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;