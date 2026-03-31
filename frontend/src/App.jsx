import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './components/Splash';
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
import ForgotPassword from './features/auth/ForgotPassword';
import Verification from './features/auth/Verification';
import NewPassword from './features/auth/NewPassword';
import Home from './features/home/Home';
import ProductDetails from './features/product/ProductDetails';
import Cart from './features/cart/Cart';
import Orders from './features/orders/Orders';
import OrderConfirmation from './features/orders/OrderConfirmation';
import ManageProfile from './features/profile/ManageProfile';
import AddLocation from './features/profile/AddLocation';
import EditProfile from './features/profile/EditProfile';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          {/* Default route redirects to Login */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path='/verify' element={<Verification />} />
          <Route path='/new-password' element={<NewPassword />} />
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/product/:id' element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path='/order-confirmation/:orderId' element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          <Route path='/profile/manage' element={<ProtectedRoute><ManageProfile /></ProtectedRoute>} />
          <Route path='/profile/add-location' element={<ProtectedRoute><AddLocation /></ProtectedRoute>} />
          <Route path='/profile/edit' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;