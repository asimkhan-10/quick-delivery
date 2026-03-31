import React, { useEffect } from 'react';
const Splash = ({ onComplete }) => {
  useEffect(() => {
    // Simulating a backend auth check or loading delay
    const timer = setTimeout(() => {
      onComplete();
    }, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="relative flex flex-col items-center animate-pulse">
        {/* Logo Container */}
        <div className="w-48 h-48 p-4 flex items-center justify-center rounded-lg mb-4">
          <img
            src="/logo.png"
            alt="Quick Delivery Logo"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Brand Text */}
        <h1 className="text-2xl font-bold text-emerald-600 tracking-tight">
          Quick <span className="text-slate-800">Delivery</span>
        </h1>
      </div>
    </div>
  );
};

export default Splash;