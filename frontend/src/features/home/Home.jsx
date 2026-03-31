import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await api.get('/home');
      try {
        if (response.data.status === 'success') {
          setProducts(response.data.data);
        }
      }
      catch (error) {
        console.error("Failed to fetch products", error);
      }
      finally {
        setLoading(false);
      }
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
          console.error("Failed to fetch cart count", e);
        }
      }
    };

    fetchProducts();
    fetchCartCount();
  }, []);

  const addToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to add items");
      navigate('/login');
      return;
    }
    try {
      await api.post('/cart/add', {
        product_id: productId,
        quantity: 1
      });
      alert("Added to cart!");
      setCartCount(prev => prev + 1);
    } catch (error) {
      console.error("Failed to add to cart", error);
      alert("Failed to add to cart");
    }

  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* --- Navbar --- */}
      <Navbar cartCount={cartCount} />

      {/* --- Hero Section --- */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <div className="z-10 animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-500 text-sm font-bold mb-6">
              🚀 Faster than you expect
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Amazing Products, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                Delivered swiftly.
              </span>
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-lg">
              Order your favorite products from the best stores in town and get them delivered to your doorstep in minutes.
            </p>
            <div className="flex gap-4">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-300 hover:bg-slate-800 transition-all transform hover:-translate-y-1">
                Order Now
              </button>
              <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                <span>▶</span> Watch Video
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 w-full aspect-square bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200 p-8 animate-float">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Delicious Food" className="w-full h-full object-cover rounded-full border-8 border-white/20 " />

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                <div className="text-3xl">✨</div>
                <div>
                  <p className="font-bold text-slate-800">Top Quality!</p>
                  <div className="flex text-orange-400 text-xs">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>

            {/* Decorative Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-200/30 blur-3xl rounded-full -z-10"></div>
          </div>

        </div>
      </section>

      {/* --- Popular Categories / Filter Buttons --- */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {['All', 'Electronics', 'Clothing', 'Groceries', 'Books', 'Home'].map((cat, i) => (
            <button key={i} className={`px-6 py-2 rounded-full border text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-500'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- Product Grid --- */}
      <div className="container mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Trending Now 🔥</h2>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <div onClick={() => navigate(`/product/${product.id}`)} key={product.id} className="group bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer">

                {/* Image Container */}
                <div className="relative h-48 mb-4 overflow-hidden rounded-2xl bg-slate-50">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm">
                    ❤️
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{product.name}</h3>
                    <span className="flex items-center text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                      ⭐ 4.5
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{product.description}</p>

                  <div className="mt-auto flex flex-col gap-3">
                    <p className="text-xl font-extrabold text-emerald-600 flex items-baseline gap-0.5">
                      <span className="text-sm">$</span>{product.price}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                        className="flex-1 py-2.5 bg-slate-100 text-slate-800 rounded-full font-bold text-sm text-center hover:bg-slate-200 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => addToCart(e, product.id)}
                        className="flex-[1.2] flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Footer --- */}
      <Footer />
    </div>
  );
};

export default Home;
