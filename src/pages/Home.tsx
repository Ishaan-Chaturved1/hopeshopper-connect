
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MessageCircle, Package, CreditCard, Users, Star, Clock, Shield } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: CheckCircle,
      title: "Verified Suppliers",
      description: "Connect with trusted, verified suppliers in your area",
      color: "bg-gradient-success",
      action: () => navigate("/suppliers")
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Real-time communication with suppliers and vendors",
      color: "bg-gradient-primary",
      action: () => navigate("/chat")
    },
    {
      icon: Package,
      title: "Bulk Orders",
      description: "Place bulk orders with ease and track delivery status",
      color: "bg-gradient-warning",
      action: () => navigate("/orders")
    },
    {
      icon: CreditCard,
      title: "Easy Payments",
      description: "Secure payment processing with multiple options",
      color: "bg-gradient-accent",
      action: () => navigate("/orders")
    }
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Active Vendors" },
    { icon: Star, value: "4.8/5", label: "Average Rating" },
    { icon: Clock, value: "24/7", label: "Support" },
    { icon: Shield, value: "100%", label: "Verified" }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">HopeShopper</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connecting street food vendors with trusted raw material suppliers. 
            Build your food business with reliable partnerships and quality ingredients.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => navigate("/register")}
            >
              Register Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3"
              onClick={() => navigate("/login")}
            >
              Vendor Login
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-3"
              onClick={() => navigate("/supplier-login")}
            >
              Supplier Login
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-custom-md transition-shadow">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-custom-lg transition-all duration-300 hover:scale-105"
              onClick={feature.action}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <Card className="bg-gradient-accent text-accent-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg max-w-3xl mx-auto">
              HopeShopper empowers street food vendors and small food businesses by connecting them 
              with reliable suppliers, enabling bulk purchases, and providing tools for growth. 
              We believe in building stronger communities through food entrepreneurship.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
