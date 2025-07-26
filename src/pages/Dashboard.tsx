
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/DashboardCard";
import { Package, Users, MessageCircle, User, LogOut, Star, Clock, Truck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, orders, suppliers, getConversations, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const conversations = getConversations();
  const recentOrders = orders.slice(0, 5);
  const topSupplier = suppliers.find(s => s.rating >= 4.8) || suppliers[0];
  const lastDelivery = orders.find(o => o.status === 'delivered');
  const nextDelivery = orders.find(o => o.status === 'shipped');

  const dashboardItems = [
    {
      icon: Users,
      title: "Suppliers",
      count: suppliers.length,
      color: "success" as const,
      onClick: () => navigate("/suppliers")
    },
    {
      icon: Package,
      title: "Orders",
      count: orders.length,
      color: "warning" as const,
      onClick: () => navigate("/orders")
    },
    {
      icon: MessageCircle,
      title: "Chat",
      count: conversations.length,
      color: "primary" as const,
      onClick: () => navigate("/chat")
    },
    {
      icon: User,
      title: "Profile",
      color: "accent" as const,
      onClick: () => navigate("/profile")
    }
  ];

  const quickStats = [
    { label: "Top Supplier", value: topSupplier.name, icon: Star },
    { label: "Last Delivery", value: lastDelivery ? "2 days ago" : "No deliveries yet", icon: Clock },
    { label: "Next Delivery", value: nextDelivery ? "Tomorrow" : "No pending deliveries", icon: Truck }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
            <p className="opacity-90">{user.businessName}</p>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="border-white text-white hover:bg-white hover:text-primary"
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
                  <stat.icon className="w-5 h-5 text-primary" />
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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length > 0 ? recentOrders.map((order, index) => (
                <div key={order.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                  order.status === 'delivered' ? 'bg-success-light' :
                  order.status === 'shipped' ? 'bg-primary-light' :
                  order.status === 'accepted' ? 'bg-warning-light' :
                  'bg-muted'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    order.status === 'delivered' ? 'bg-success' :
                    order.status === 'shipped' ? 'bg-primary' :
                    order.status === 'accepted' ? 'bg-warning' :
                    'bg-muted-foreground'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium">{order.material} order from {order.supplierName}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    order.status === 'delivered' ? 'bg-success text-success-foreground' :
                    order.status === 'shipped' ? 'bg-primary text-primary-foreground' :
                    order.status === 'accepted' ? 'bg-warning text-warning-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {order.status}
                  </span>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No orders yet. Start by browsing suppliers!</p>
                  <Button className="mt-3" onClick={() => navigate("/suppliers")}>
                    Browse Suppliers
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
