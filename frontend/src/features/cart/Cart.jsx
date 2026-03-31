import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Footer from '../../components/Footer';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [deliveryCharge, setDeliveryCharge] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return; // Cart might be empty or redirect login

            // Fetch Cart
            const response = await api.get('/cart');
            setCartItems(response.data.cart);
            setSubTotal(response.data.sub_total);
            setDeliveryCharge(response.data.delivery_charge);
            setTotal(response.data.total);

            // Fetch Locations
            const profileResponse = await api.get('/profile');
            if (profileResponse.data && profileResponse.data.locations) {
                setLocations(profileResponse.data.locations);
                // Default to first location if none selected, or try to find a default
                if (profileResponse.data.locations.length > 0 && !selectedLocation) {
                    setSelectedLocation(profileResponse.data.locations[0]);
                }
            }

        } catch (error) {
            console.error("Failed to fetch cart", error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (productId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;

        try {
            await api.post('/cart/add', {
                product_id: productId,
                quantity: newQuantity
            });
            fetchCart(); // Refresh cart to get updated totals
        } catch (error) {
            console.error("Failed to update cart", error);
        }
    };

    const removeItem = async (id) => {
        try {
            await api.delete(`/cart/remove/${id}`);
            fetchCart();
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    const placeOrder = async () => {
        if (cartItems.length === 0) return;
        setLoading(true);
        try {
            const response = await api.post('/orders/place');
            alert(response.data.message);
            navigate('/orders');
        } catch (error) {
            console.error("Failed to place order", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen text-slate-500">Loading Cart...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* Header / Navbar Placeholder */}
            <div className="bg-white shadow-sm p-4 mb-8 sticky top-0 z-10">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/home" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">My Cart</h1>
                    </div>
                    <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {cartItems.length} Items
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Column: Cart Items */}
                    <div className="flex-1 w-full space-y-4">

                        {/* Location Selector */}
                        <div className="relative z-20">
                            <div
                                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                                className={`bg-white p-4 rounded-2xl shadow-sm border ${isLocationDropdownOpen ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-100'} flex items-center gap-4 mb-6 cursor-pointer hover:border-emerald-300 transition-all`}
                            >
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Delivery Location</p>
                                    <p className="text-slate-800 font-medium truncate">
                                        {selectedLocation ? selectedLocation.address : 'Select a location'}
                                    </p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Dropdown Menu */}
                            {isLocationDropdownOpen && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-30">
                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                        {locations.length > 0 ? (
                                            locations.map((loc) => (
                                                <div
                                                    key={loc.id}
                                                    onClick={() => {
                                                        setSelectedLocation(loc);
                                                        setIsLocationDropdownOpen(false);
                                                    }}
                                                    className={`p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center gap-3 ${selectedLocation?.id === loc.id ? 'bg-emerald-50/50' : ''}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full ${selectedLocation?.id === loc.id ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{loc.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{loc.address}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-slate-400 text-sm">No details found.</div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => navigate('/profile/add-location')}
                                        className="w-full p-3 bg-slate-50 text-emerald-600 font-bold text-sm hover:bg-emerald-50 transition-colors border-t border-slate-100 flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add New Location
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cart List */}
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div key={item.id} className="group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 md:gap-6 items-center hover:shadow-md transition-all">
                                    {/* Image */}
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.product?.image_url} alt={item.product?.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 text-lg truncate">{item.product?.name}</h3>
                                        <p className="text-slate-400 text-sm line-clamp-1 mb-2">{item.product?.description}</p>
                                        <div className="font-bold text-emerald-600 text-lg">$ {parseFloat(item.product?.price).toFixed(2)}</div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col items-end gap-2 md:flex-row md:items-center">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity, -1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-emerald-600 shadow-sm hover:bg-emerald-500 hover:text-white transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity, 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-emerald-500 rounded-md text-white shadow-sm hover:bg-emerald-600 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Delete Button (Web adaptation of Swipe) */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 text-slate-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove Item"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                <p className="text-slate-400 mb-4">Your cart is empty</p>
                                <Link to="/home" className="text-emerald-500 font-bold hover:underline">Start Shopping</Link>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary (Sticky on Desktop) */}
                    <div className="w-full lg:w-96 lg:sticky lg:top-28 h-fit">
                        <div className="bg-emerald-500 p-6 md:p-8 rounded-3xl shadow-xl shadow-emerald-200 text-white relative overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                            <h2 className="text-xl font-bold mb-6 relative z-10">Order Summary</h2>

                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex justify-between items-center text-emerald-100">
                                    <span>Sub-Total</span>
                                    <span className="font-semibold text-white">$ {parseFloat(subTotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-emerald-100">
                                    <span>Delivery Charge</span>
                                    <span className="font-semibold text-white">$ {parseFloat(deliveryCharge).toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-white/20 my-4"></div>
                                <div className="flex justify-between items-center text-2xl font-bold">
                                    <span>Total</span>
                                    <span>$ {parseFloat(total).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={placeOrder}
                                disabled={cartItems.length === 0}
                                className="w-full bg-white text-emerald-600 font-bold py-4 rounded-xl shadow-lg hover:bg-emerald-50 active:scale-95 transition-all relative z-10 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Processing...' : 'Place My Order'}
                            </button>
                        </div>

                        {/* Trust Badges / Info */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl mb-2">⚡</span>
                                <span className="text-xs font-bold text-slate-600">Fast Delivery</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl mb-2">🛡️</span>
                                <span className="text-xs font-bold text-slate-600">Secure Payment</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Cart;
