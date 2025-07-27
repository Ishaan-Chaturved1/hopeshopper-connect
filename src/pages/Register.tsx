
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Phone, Building, Lock, Truck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"vendor" | "supplier">("vendor");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    businessName: "",
    businessType: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
    if (!formData.businessType) newErrors.businessType = "Business type is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = register(formData);
    
    if (success) {
      toast({
        title: "Registration Successful!",
        description: `Welcome to HopeShopper. You can now access your ${userType} dashboard.`,
      });
      navigate(userType === "vendor" ? "/dashboard" : "/supplier-dashboard");
    } else {
      toast({
        title: "Registration Failed",
        description: "An account with this phone number already exists.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const vendorBusinessTypes = [
    { value: "street-food", label: "Street Food Vendor" },
    { value: "restaurant", label: "Small Restaurant" },
    { value: "catering", label: "Catering Service" },
    { value: "food-truck", label: "Food Truck" },
    { value: "other", label: "Other Food Business" }
  ];

  const supplierBusinessTypes = [
    { value: "vegetables", label: "Vegetable Supplier" },
    { value: "spices", label: "Spice Supplier" },
    { value: "grains", label: "Grain Supplier" },
    { value: "dairy", label: "Dairy Supplier" },
    { value: "meat", label: "Meat Supplier" },
    { value: "general", label: "General Supplier" }
  ];

  const businessTypes = userType === "vendor" ? vendorBusinessTypes : supplierBusinessTypes;

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-custom-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-primary">HopeShopper</h1>
            <div className="w-10" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join our community of food entrepreneurs</CardDescription>
        </CardHeader>

        <CardContent>
          {/* User Type Selector */}
          <div className="mb-6">
            <Label className="text-sm font-medium">I am a:</Label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant={userType === "vendor" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setUserType("vendor")}
              >
                <User className="w-4 h-4 mr-2" />
                Vendor
              </Button>
              <Button
                type="button"
                variant={userType === "supplier" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setUserType("supplier")}
              >
                <Truck className="w-4 h-4 mr-2" />
                Supplier
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`transition-all duration-300 ${errors.name ? "border-destructive" : "focus:border-primary"}`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`transition-all duration-300 ${errors.phone ? "border-destructive" : "focus:border-primary"}`}
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Business Name
              </Label>
              <Input
                id="businessName"
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                className={`transition-all duration-300 ${errors.businessName ? "border-destructive" : "focus:border-primary"}`}
                placeholder="Enter your business name"
              />
              {errors.businessName && <p className="text-sm text-destructive">{errors.businessName}</p>}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Business Type
              </Label>
              <Select onValueChange={(value) => handleInputChange("businessType", value)}>
                <SelectTrigger className={`transition-all duration-300 ${errors.businessType ? "border-destructive" : "focus:border-primary"}`}>
                  <SelectValue placeholder={`Select your ${userType} type`} />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.businessType && <p className="text-sm text-destructive">{errors.businessType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`transition-all duration-300 ${errors.password ? "border-destructive" : "focus:border-primary"}`}
                placeholder="Create a secure password"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
