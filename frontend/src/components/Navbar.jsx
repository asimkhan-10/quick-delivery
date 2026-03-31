import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Navbar = ({ cartCount: propCartCount }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // If cartCount is passed as prop, use it. Otherwise fetch it.
        if (propCartCount !== undefined) {
            setCartCount(propCartCount);
            return;
        }

        const fetchCartCount = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/cart');
                    if (response.data.cart) {
                        setCartCount(response.data.cart.length);
                    }
                } catch (e) {
                    // console.error(e); 
                }
            }
        };

        fetchCartCount();
    }, [propCartCount]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/home" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200">
                        Q
                    </div>
                    <span className="text-xl font-extrabold text-slate-800 tracking-tight">Quick<span className="text-emerald-500">Del</span></span>
                </Link>

                {/* Search Bar (Hidden on mobile) */}
                <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 border border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" placeholder="Search for 'Pizza'..." className="bg-transparent border-none focus:outline-none ml-2 w-full text-slate-700 placeholder-slate-400" />
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/home" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Home</Link>
                    <Link to="/orders" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Orders</Link>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors focus:outline-none"
                        >
                            Profile <span className="text-xs">▼</span>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 z-50">
                                <Link
                                    to="/profile/manage"
                                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    Manage Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-slate-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <Link to="/cart" className="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors">
                        <span className="text-xl">🛒</span>
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm text-center">{cartCount}</span>
                        )}
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <Link to="/cart" className="relative p-2 text-slate-600">
                        <span className="text-xl">🛒</span>
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                        )}
                    </Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 text-2xl focus:outline-none">
                        {isMenuOpen ? '✖' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-4 shadow-lg absolute w-full left-0 top-full">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <Link to="/home" className="block text-slate-600 hover:text-emerald-600 font-medium">Home</Link>
                    <Link to="/orders" className="block text-slate-600 hover:text-emerald-600 font-medium">Orders</Link>
                    <div className="border-t border-slate-100 my-2 pt-2">
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Account</p>
                        <Link to="/profile/manage" className="block text-slate-600 hover:text-emerald-600 font-medium py-2">Manage Profile</Link>
                        <button onClick={handleLogout} className="block w-full text-left text-red-500 font-medium py-2">Logout</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
