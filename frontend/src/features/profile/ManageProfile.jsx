import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const ManageProfile = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        name: '',
        email: '',
        avatar: '',
        address: '',
        locations: []
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                const userData = response.data;
                setUser({
                    ...userData,
                    avatar: userData.profile_photo
                        ? (userData.profile_photo.startsWith('http') ? userData.profile_photo : `http://127.0.0.1:8000/uploads/${userData.profile_photo.replace(/\\/g, '/')}`)
                        : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    // Fallback for address if not present in DB
                    address: userData.location || 'No address set',
                    locations: userData.locations || []
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-4xl">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Profile</h1>
                    <Link to="/profile/edit" className="text-slate-800 font-bold hover:text-emerald-600 transition-colors">
                        Edit Profile
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4">
                        <img
                            src={user.avatar}
                            alt={user.name || 'Profile'}
                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; }}
                        />
                        {/* Use CSS or a library for the shadow/glow effect if needed */}
                        <div className="absolute inset-0 rounded-full border border-slate-100 pointer-events-none"></div>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">{user.name}</h2>
                    <p className="text-slate-500 font-medium">{user.email}</p>
                </div>

                <div className="space-y-6">
                    {/* Current Address Card */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-emerald-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-slate-800 font-semibold text-lg">{user.address}</span>
                    </div>

                    {/* Locations Card/Section */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Locations</h3>
                            </div>
                            <Link to="/profile/add-location" className="w-8 h-8 rounded-full border border-emerald-500 text-emerald-500 flex items-center justify-center hover:bg-emerald-50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>

                        <h4 className="text-lg font-bold text-slate-800 mb-4">Locations</h4>

                        <div className="space-y-4">
                            {user.locations.map((location) => (
                                <div key={location.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white hover:bg-slate-50 transition-colors border border-slate-100 hover:border-slate-200 cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 mb-1">{location.name}</h5>
                                        <p className="text-slate-400 text-sm">{location.address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default ManageProfile;
