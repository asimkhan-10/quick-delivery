import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Footer from '../../components/Footer';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                if (response.data.status === 'success') {
                    setProduct(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        setAdding(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please login to add items to cart");
                navigate('/login');
                return;
            }

            await api.post('/cart/add', {
                product_id: product.id,
                quantity: quantity
            });
            alert("Added to cart successfully!");
            navigate('/cart');
        } catch (error) {
            console.error("Failed to add to cart", error);
            alert("Failed to add to cart");
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen text-slate-500">Loading...</div>;
    if (!product) return <div className="flex justify-center items-center min-h-screen text-slate-500">Product not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Navbar Placeholder / Back Button */}
            <div className="absolute top-0 left-0 p-6 z-20">
                <Link to="/home" className="flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-slate-700 hover:bg-white hover:text-emerald-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 lg:py-28 h-full">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:h-[80vh]">

                    {/* Left Column: Image Section */}
                    <div className="relative h-96 md:h-full bg-pink-100 flex items-center justify-center p-8 overflow-hidden">
                        {/* Abstract Background Design matching user image vibe */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="relative z-10 w-auto h-3/4 max-w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Right Column: Details Section */}
                    <div className="p-8 md:p-12 lg:p-16 flex flex-col h-full overflow-y-auto">

                        {/* Header Info */}
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">{product.name}</h1>
                        </div>

                        {/* Price */}
                        <div className="text-3xl font-bold text-slate-900 mb-6">${product.price}</div>

                        {/* Description */}
                        <div className="prose prose-slate mb-8 text-slate-500 leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        {/* Actions Footer - Pushed to bottom */}
                        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-4">
                            {/* Quantity Stepper */}
                            <div className="flex items-center bg-slate-100 rounded-xl px-4 py-3">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-500 hover:text-emerald-600 font-bold text-lg">-</button>
                                <span className="mx-4 font-bold text-slate-800 min-w-[20px] text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="text-slate-500 hover:text-emerald-600 font-bold text-lg">+</button>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={addToCart}
                                disabled={adding}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:shadow-none"
                            >
                                <span>{adding ? "Adding..." : "Add to Cart"}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetails;
