import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Orders from './pages/Orders';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import SupplierLogin from './pages/SupplierLogin';
import SupplierDashboard from './pages/SupplierDashboard';
import SupplierRequests from './pages/SupplierRequests';
import SupplierProfile from './pages/SupplierProfile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/supplier-login" element={<SupplierLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
            <Route path="/supplier-requests" element={<SupplierRequests />} />
            <Route path="/supplier-profile" element={<SupplierProfile />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
