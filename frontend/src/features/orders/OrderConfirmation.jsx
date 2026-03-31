import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [signature, setSignature] = useState(null);
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    const handleSignatureUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSignature(file);
        }
    };
    const handleSubmit = async () => {
        if (!image) {
            alert("Please upload an image of the delivered items.");
            return;
        }
        if (!signature) {
            alert("Please provide a signature.");
            return;
        }
        const formData = new FormData();
        formData.append('delivery_photo', image);
        formData.append('signature', signature);

        setLoading(true);
        try {
            await api.post(`/orders/${orderId}/confirm`, formData, {
                headers: {
                    'Content-Type': undefined,
                },
            });
            alert("Delivery confirmed successfully!");
            navigate('/orders');
        } catch (error) {
            console.error("Failed to confirm delivery", error.response?.data || error);
            const errorMessage = error.response?.data?.message || "Failed to confirm delivery. Please try again.";
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-4 flex flex-col items-center">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 bg-emerald-50 rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-800">Orders Confirmation</h1>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md z-20 border-2 border-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">Upload images of delivered items</h3>
                        <label className="inline-block cursor-pointer">
                            <span className="sr-only">Choose file</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-emerald-50 file:text-emerald-700
                                hover:file:bg-emerald-100
                            "/>
                        </label>
                        {image && <p className="text-xs text-emerald-600 mt-2">Selected: {image.name}</p>}
                    </div>
                </div>

                {/* Signature Section */}
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md z-20 border-2 border-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">Upload image of Signature</h3>
                        <label className="inline-block cursor-pointer">
                            <span className="sr-only">Choose file</span>
                            <input type="file" accept="image/*" onChange={handleSignatureUpload} className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-emerald-50 file:text-emerald-700
                                hover:file:bg-emerald-100
                            "/>
                        </label>
                        {signature && <p className="text-xs text-emerald-600 mt-2">Selected: {signature.name}</p>}
                    </div>
                </div>
                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : 'Done'}
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;
