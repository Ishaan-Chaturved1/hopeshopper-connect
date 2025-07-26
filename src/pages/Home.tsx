import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, MessageCircle, Package, CreditCard } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import heroImage from "@/assets/hero-vendor.jpg";
import logo from "@/assets/logo.png";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Verified Suppliers",
      description: "All suppliers are verified for quality and reliability",
      color: "success" as const
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Direct communication with suppliers for better deals",
      color: "primary" as const
    },
    {
      icon: Package,
      title: "Bulk Orders",
      description: "Order raw materials in bulk for better prices",
      color: "warning" as const
    },
    {
      icon: CreditCard,
      title: "Easy Payments",
      description: "Simple and secure payment methods",
      color: "accent" as const
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative min-h-screen bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60"></div>
        
        <div className="relative container mx-auto px-4 text-center text-white">
          <div className="flex items-center justify-center mb-8">
            <img src={logo} alt="HopeShopper" className="w-20 h-20 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold">HopeShopper</h1>
          </div>
          
          <p className="text-xl md:text-2xl mb-8 font-medium">
            Connecting Vendors. Empowering Quality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 h-auto"
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 h-auto border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose HopeShopper?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of vendors already using HopeShopper
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-4 h-auto border-white text-white hover:bg-white hover:text-primary"
            onClick={() => navigate("/register")}
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;