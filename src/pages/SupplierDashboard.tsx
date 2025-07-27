
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/DashboardCard";
import { Package, Users, MessageCircle, User, LogOut, Star, Clock, Truck, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const { user, getSupplierRequests, getSupplierOrders } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'supplier') {
      navigate("/supplier-login");
    }
  }, [user, navigate]);

  if (!user || user.role !== 'supplier') {
    return null;
  }

  const supplierRequests = getSupplierRequests(user.id);
  const supplierOrders = getSupplierOrders(user.id);
  const pendingRequests = supplierRequests.filter(req => req.status === 'pending');
  const completedOrders = supplierOrders.filter(order => order.status === 'delivered');

  const dashboardItems = [
    {
      icon: AlertCircle,
      title: "New Requests",
      count: pendingRequests.length,
      color: "warning" as const,
      onClick: () => navigate("/supplier-requests")
    },
    {
      icon: Package,
      title: "Products",
      count: 12,
      color: "success" as const,
      onClick: () => navigate("/supplier-products")
    },
    {
      icon: MessageCircle,
      title: "Chat",
      count: 8,
      color: "primary" as const,
      onClick: () => navigate("/supplier-chat")
    },
    {
      icon: User,
      title: "Profile",
      color: "accent" as const,
      onClick: () => navigate("/supplier-profile")
    }
  ];

  const quickStats = [
    { label: "Total Orders", value: supplierOrders.length, icon: Package },
    { label: "Rating", value: "4.8/5", icon: Star },
    { label: "Completed", value: completedOrders.length, icon: Truck }
  ];

  const recentRequests = supplierRequests.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-success text-success-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
            <p className="opacity-90">{user.businessName}</p>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/")}
            className="border-white text-white hover:bg-white hover:text-success"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <stat.icon className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-semibold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <DashboardCard key={index} {...item} />
          ))}
        </div>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {recentRequests.length > 0 ? (
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div key={request.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                    request.status === 'delivered' ? 'bg-success-light' :
                    request.status === 'accepted' ? 'bg-primary-light' :
                    'bg-warning-light'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      request.status === 'delivered' ? 'bg-success' :
                      request.status === 'accepted' ? 'bg-primary' :
                      'bg-warning'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium">{request.vendorName} - {request.material}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {request.quantity}kg</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      request.status === 'delivered' ? 'bg-success text-success-foreground' :
                      request.status === 'accepted' ? 'bg-primary text-primary-foreground' :
                      'bg-warning text-warning-foreground'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent requests</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDashboard;
