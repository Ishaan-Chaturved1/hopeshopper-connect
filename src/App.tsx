
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SupplierLogin from "./pages/SupplierLogin";
import Dashboard from "./pages/Dashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import Suppliers from "./pages/Suppliers";
import Orders from "./pages/Orders";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="supplier-login" element={<SupplierLogin />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="supplier-dashboard" element={<SupplierDashboard />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="orders" element={<Orders />} />
              <Route path="chat" element={<Chat />} />
              <Route path="profile" element={<Profile />} />
              <Route path="supplier-requests" element={<div>Supplier Requests Page</div>} />
              <Route path="supplier-products" element={<div>Supplier Products Page</div>} />
              <Route path="supplier-chat" element={<Chat />} />
              <Route path="supplier-profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
