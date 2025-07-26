import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/DashboardCard";
import { Package, Users, MessageCircle, User, LogOut, Star, Clock, Truck } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      icon: Users,
      title: "Suppliers",
      count: 24,
      color: "success" as const,
      onClick: () => navigate("/suppliers")
    },
    {
      icon: Package,
      title: "Orders",
      count: 8,
      color: "warning" as const,
      onClick: () => navigate("/orders")
    },
    {
      icon: MessageCircle,
      title: "Chat",
      count: 3,
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
    { label: "Top Supplier", value: "Fresh Veggies Co", icon: Star },
    { label: "Last Delivery", value: "2 days ago", icon: Clock },
    { label: "Next Delivery", value: "Tomorrow", icon: Truck }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Rajesh!</h1>
            <p className="opacity-90">Rajesh's Street Food Corner</p>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/")}
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
              <div className="flex items-center gap-3 p-3 rounded-lg bg-success-light">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Order delivered from Fresh Veggies Co</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-warning-light">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">New message from Spice World</p>
                  <p className="text-sm text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-light">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Order placed for rice and lentils</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;