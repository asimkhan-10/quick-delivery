import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const AddLocation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/locations/add', {
                name: formData.name,
                address: formData.location, // Map location to address
                description: formData.description
            });
            navigate('/profile/manage');
        } catch (error) {
            console.error('Error adding location:', error);
            if (error.response && error.response.data) {
                console.error('Validation errors:', error.response.data);
                alert(`Error: ${error.response.data.message || 'Failed to add location'}`);
            } else {
                alert('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-4xl">

                {/* Back Button & Title */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/profile/manage')}
                        className="p-3 bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Add New Location</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">

                    {/* Illustration / Info Side */}
                    <div className="hidden md:flex flex-col items-center justify-center bg-emerald-50 rounded-3xl p-8 border border-emerald-100 min-h-[400px]">
                        <div className="relative w-64 h-64 mb-6">
                            <img
                                src="https://img.freepik.com/free-vector/shop-with-sign-we-are-open_23-2148547718.jpg?w=740&t=st=1708450000~exp=1708450600~hmac=..."
                                alt="Store Location"
                                className="w-full h-full object-cover rounded-2xl shadow-lg mix-blend-multiply"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            {/* Fallback Icon */}
                            <div className="hidden absolute inset-0 bg-white/50 rounded-2xl items-center justify-center">
                                <span className="text-8xl">🏪</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-emerald-800 mb-2">New Delivery Spot?</h3>
                        <p className="text-emerald-600 text-center max-w-xs">Add your home, office, or favorite delivery spot to make ordering even faster.</p>
                    </div>

                    {/* Form Side */}
                    <div className="bg-white rounded-3xl shadow-lg shadow-slate-100 p-6 md:p-8 border border-slate-100">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Location Name Input */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Location Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Home, Office"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder-slate-400 font-medium text-slate-700"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Location Address Input */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Full address here..."
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder-slate-400 font-medium text-slate-700"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description Input */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Description (Optional)</label>
                                <div className="relative group">
                                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Gate code, floor number, etc."
                                        rows="3"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder-slate-400 font-medium text-slate-700 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-95 transition-all mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving...' : 'Save Location'}
                            </button>

                        </form>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default AddLocation;
