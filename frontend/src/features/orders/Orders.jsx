import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Footer from '../../components/Footer';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const ORDER_STEPS = [
        'Order placed',
        'Order confirmed',
        'Order shipped',
        'Out for delivery',
        'Order delivered'
    ];
    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                navigate('/login')
                return;
            }
            try {
                const response = await api.get('/orders');
                setOrders(response.data)
            }
            catch (error) {
                console.error("Failed to fetch orders", error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchOrders();

    }, [navigate]);

    const getStatusColor = (status) => {
        if (!status) return 'bg-slate-100 text-slate-600';

        const s = status.toLowerCase();

        if (s.includes('pending') || s.includes('placed')) {
            return 'bg-orange-100 text-orange-600';
        } else if (s.includes('delivered')) {
            return 'bg-emerald-100 text-emerald-600';
        } else if (s.includes('cancelled')) {
            return 'bg-red-100 text-red-600';
        } else {
            return 'bg-green-200 text-slate-600';
        }
    };

    const toggleExpand = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    const getCurrentStepIndex = (status) => {
        if (!status) return 0;
        const s = status.toLowerCase();
        if (s.includes('delivered')) return 4;
        if (s.includes('out for delivery')) return 3;
        if (s.includes('shipped')) return 2;
        if (s.includes('confirmed')) return 1;
        return 0; // Default to placed
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            await api.post(`/orders/${orderId}/cancel`);
            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: 'Cancelled' } : order
            ));
            alert("Order cancelled successfully");
        } catch (error) {
            console.error("Failed to cancel order", error);
            alert("Failed to cancel order");
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-500">Loading orders...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="container mx-auto flex items-center gap-4">
                    <Link to="/home" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">My Orders</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-8">
                <div className="max-w-3xl mx-auto space-y-6">

                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400 mb-4">No orders found</p>
                            <Link to="/home" className="text-emerald-500 font-bold hover:underline">Start Shopping</Link>
                        </div>
                    ) : (
                        orders.map((order) => {
                            const currentStep = getCurrentStepIndex(order.status);
                            const isCancellable = order.status === 'Order placed' || order.status === 'Order confirmed';

                            return (
                                <div key={order.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Image - Use first item's image or placeholder */}
                                        <div className="w-full sm:w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={order.items && order.items.length > 0 && order.items[0].product ? order.items[0].product.image_url : "https://via.placeholder.com/150"}
                                                alt="Order"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-lg">Order #{order.id}</h3>
                                                    <p className="text-slate-400 font-semibold text-sm">Placed on {new Date(order.created_at).toLocaleDateString()} • {order.items.length} Items</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                    <div className="text-xl font-bold text-emerald-600">
                                                        ${parseFloat(order.total).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Items Preview (collapsed) */}
                                            {!expandedOrderId || expandedOrderId !== order.id ? (
                                                <div className="mt-3 space-y-1">
                                                    {order.items.slice(0, 2).map((item, idx) => (
                                                        <p key={idx} className="text-slate-600 text-sm flex justify-between">
                                                            <span>{item.quantity}x {item.product ? item.product.name : 'Unknown Item'}</span>
                                                        </p>
                                                    ))}
                                                    {order.items.length > 2 && <p className="text-xs text-slate-400">+{order.items.length - 2} more items...</p>}
                                                </div>
                                            ) : null}

                                            {/* Timeline & Full Details (Expanded) */}
                                            {expandedOrderId === order.id && (
                                                <div className="mt-6 border-t border-slate-100 pt-6 animate-fade-in-down">
                                                    {/* Timeline */}
                                                    <div className="relative pl-6 space-y-8 mb-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                                        {ORDER_STEPS.map((step, index) => {
                                                            const isCompleted = index <= currentStep;
                                                            const isCurrent = index === currentStep;

                                                            return (
                                                                <div key={index} className="relative flex items-center gap-4">
                                                                    {/* Dot */}
                                                                    <div className={`absolute -left-[5px] w-4 h-4 rounded-full border-2 z-10 ${isCompleted ? 'bg-emerald-500 border-white ring-2 ring-emerald-100' : 'bg-slate-200 border-white'}`}></div>

                                                                    {/* Text */}
                                                                    <div className="pl-6 flex-1 flex justify-between items-center">
                                                                        <span className={`text-sm font-bold ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                                                                            {step}
                                                                        </span>
                                                                        <span className="text-xs text-slate-400">
                                                                            {index === 0 ? new Date(order.created_at).toLocaleDateString() : (isCompleted ? new Date(order.updated_at).toLocaleDateString() : 'Pending')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Full Items List */}
                                                    <h4 className="font-bold text-slate-800 mb-2 text-sm">Order Items</h4>
                                                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between text-sm">
                                                                <span className="text-slate-700 font-medium">{item.quantity}x {item.product ? item.product.name : 'Unknown Item'}</span>
                                                                <span className="text-slate-500">${parseFloat(item.price).toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Footer (Price & Action) */}
                                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                                                <div className="text-xl font-bold text-emerald-600">
                                                    ${parseFloat(order.total).toFixed(2)}
                                                </div>
                                                <div className="flex gap-3">
                                                    {isCancellable && (
                                                        <button
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-xl hover:bg-red-100 transition-colors"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                    {['Out for delivery', 'Out for Delivery'].includes(order.status) && (
                                                        <button
                                                            onClick={() => navigate(`/order-confirmation/${order.id}`)}
                                                            className="px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 shadow-md hover:shadow-lg transition-all"
                                                        >
                                                            Confirm Your Delivery
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => toggleExpand(order.id)}
                                                        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-emerald-500"
                                                    >
                                                        {expandedOrderId === order.id ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7-7" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Orders;
