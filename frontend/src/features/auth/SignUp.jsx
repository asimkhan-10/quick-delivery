import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Ensure this path matches your api.js location

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const [formData, setFormData] = useState({
    name: '',                // Matches Laravel 'name'
    email: '',               // Matches Laravel 'email'
    location: '',            // Matches Laravel 'location'
    phone: '',               // Matches Laravel 'phone' (Added)
    password: '',            // Matches Laravel 'password'
    password_confirmation: '' // Matches Laravel 'confirmed' rule
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend check before hitting the API
    if (formData.password !== formData.password_confirmation) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Hits Route::post('/register', [AuthController::class, 'register'])
      const response = await api.post('/register', formData)
      if (response.status === 200 || response.status === 201) {
        alert("Account Created Successfully!");
        navigate('/login');
      }
    } catch (error) {

      const errorData = error.response?.data;
      if (error.response?.status === 422) {
        const firstError = Object.values(errorData)[0][0];
        alert(firstError);
      } else {
        alert(errorData?.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M85.2007 64.9C88.3007 58.8 90.0007 51.9 90.0007 44.7C89.8008 20.6 69.3008 0 45.0008 0C38.3008 0 32.0008 1.5 26.3008 4.1C25.6007 4.4 25.0008 4.7 24.3008 5.1C9.80075 12.6 -0.0992493 27.8 0.000750676 45.3C0.000750676 50.2 0.900751 54.9 2.30075 59.3C2.30075 59.5 2.40075 59.7 2.50075 59.9C2.60075 60.3 2.80075 60.6 2.90075 61C9.40075 77.9 25.8008 90 44.9008 90H45.2008C62.5008 90 77.8007 79.6 85.2007 64.9ZM58.3008 9.2C60.9007 9.2 63.0008 11.3 63.0008 13.9C63.0008 16.5 60.9007 18.6 58.3008 18.6C55.7008 18.6 53.6007 16.5 53.6007 13.9C53.6007 11.3 55.7008 9.2 58.3008 9.2ZM8.60075 59.5L32.2008 39.1C32.4008 38.9 32.7008 38.9 32.8008 38.9C32.9007 38.9 33.2008 39 33.4008 39.2L61.9008 80.3C56.8008 82.8 51.1008 84.1 45.2008 84.1H45.0008C28.6008 84.2 14.4008 74 8.60075 59.5ZM72.9007 72.5C71.1007 74.3 69.1007 76 67.0007 77.4L52.9008 57.2L65.0007 46.7C65.2007 46.5 65.5007 46.5 65.6007 46.5C65.7007 46.5 66.0007 46.6 66.2007 46.8L79.0007 64.4C77.4007 67.4 75.3008 70.1 72.9007 72.5Z" fill="url(#paint0_linear_1_1743)" />
              <defs>
                <linearGradient id="paint0_linear_1_1743" x1="45.0004" y1="0" x2="45.0004" y2="90" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#53E88B" />
                  <stop offset="1" stopColor="#2F824E" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Sign Up</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />

          {/* Phone (New Required Field) */}
          {/* <input
            type="tel"
            placeholder="Phone Number"
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          /> */}
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            maxLength={11}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // only numbers
              setFormData({ ...formData, phone: value });
            }}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
            required
          />


          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-[0.98] transition-all"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-slate-600 text-sm">
          Already have an account?{" "}
          <Link to='/login' className="text-emerald-600 font-bold hover:underline" >Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;