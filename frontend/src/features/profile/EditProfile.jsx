import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const EditProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        password: '',
        confirmPassword: ''
    });

    const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80');
    const [selectedFile, setSelectedFile] = useState(null);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                const user = response.data;
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    location: user.location || '',
                    password: '',
                    confirmPassword: ''
                });
                if (user.profile_photo) {
                    setAvatar(user.profile_photo.startsWith('http') ? user.profile_photo : `http://127.0.0.1:8000/uploads/${user.profile_photo.replace(/\\/g, '/')}`);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAvatar(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        setUpdating(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('location', formData.location);
            if (formData.password) {
                data.append('password', formData.password);
                data.append('password_confirmation', formData.confirmPassword);
            }
            if (selectedFile) {
                data.append('profile_photo', selectedFile);
            }

            await api.post('/profile/update', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/profile/manage');
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response && error.response.data) {
                const message = error.response.data.message || 'Failed to update profile.';
                const validationErrors = error.response.data.errors
                    ? '\n' + Object.values(error.response.data.errors).flat().join('\n')
                    : '';
                alert(`Error: ${message}${validationErrors}`);
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 md:px-6 py-4 flex flex-col justify-center max-w-5xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <button
                        onClick={() => navigate('/profile/manage')}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">Edit Profile</h1>
                </div>

                <div className="grid md:grid-cols-3 gap-6 items-start h-full max-h-[calc(100vh-160px)]">

                    {/* Left Side: Avatar & Info */}
                    <div className="hidden md:flex flex-col items-center justify-center bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full">
                        <div className="relative w-40 h-40 mb-6 group cursor-pointer" onClick={triggerFileInput}>
                            <img
                                src={avatar}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full border-4 border-emerald-50 group-hover:opacity-75 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                                <span className="text-white font-bold">Change</span>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
                                className="absolute bottom-2 right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg hover:bg-emerald-600 transition-all border-2 border-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/jpeg,image/png,image/jpg"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{formData.name}</h3>
                        <p className="text-slate-400 text-sm">{formData.email}</p>
                    </div>

                    {/* Right Side: Form */}
                    <div className="md:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-100 p-6 md:p-8 border border-slate-100 h-full overflow-y-auto custom-scrollbar">

                        {/* Mobile Avatar View */}
                        <div className="md:hidden flex justify-center mb-6">
                            <div className="relative w-24 h-24" onClick={triggerFileInput}>
                                <img src={avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                <button type="button" className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Name */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                                />
                            </div>

                            {/* Email */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                                />
                            </div>

                            {/* Location */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Location"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={updating}
                                className={`w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-95 transition-all mt-6 ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {updating ? 'Updating...' : 'Update Profile'}
                            </button>

                        </form>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default EditProfile;
