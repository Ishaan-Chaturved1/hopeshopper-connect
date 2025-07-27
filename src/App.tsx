
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Suppliers from "@/pages/Suppliers";
import Orders from "@/pages/Orders";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import SupplierLogin from "@/pages/SupplierLogin";
import SupplierDashboard from "@/pages/SupplierDashboard";
import SupplierRequests from "@/pages/SupplierRequests";
import SupplierProfile from "@/pages/SupplierProfile";
import SupplierProducts from "@/pages/SupplierProducts";
import SupplierChat from "@/pages/SupplierChat";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/supplier-login" element={<SupplierLogin />} />
              <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
              <Route path="/supplier-requests" element={<SupplierRequests />} />
              <Route path="/supplier-profile" element={<SupplierProfile />} />
              <Route path="/supplier-products" element={<SupplierProducts />} />
              <Route path="/supplier-chat" element={<SupplierChat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
