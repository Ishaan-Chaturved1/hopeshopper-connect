
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Edit, Phone, Building, LogOut, Package, Headphones } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, orders, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {
    id: "",
    name: "",
    phone: "",
    businessType: "",
    businessName: ""
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSaveProfile = () => {
    updateProfile(editedUser);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success text-success-foreground';
      case 'shipped': return 'bg-primary text-primary-foreground';
      case 'accepted': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-accent text-accent-foreground p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-accent-foreground hover:bg-accent-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="opacity-90">Manage your account and settings</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Personal Information</CardTitle>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <p className="text-muted-foreground">{user.businessName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{user.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{user.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Business Type
                </Label>
                {isEditing ? (
                  <Select 
                    value={editedUser.businessType}
                    onValueChange={(value) => setEditedUser(prev => ({ ...prev, businessType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="street-food">Street Food Vendor</SelectItem>
                      <SelectItem value="restaurant">Small Restaurant</SelectItem>
                      <SelectItem value="catering">Catering Service</SelectItem>
                      <SelectItem value="food-truck">Food Truck</SelectItem>
                      <SelectItem value="other">Other Food Business</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="p-2 bg-muted rounded capitalize">
                    {user.businessType.replace('-', ' ')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Business Name</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.businessName}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Enter your business name"
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{user.businessName}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order History ({orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.material}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.supplierName} • {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(order.status)} mb-1`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <p className="text-sm font-medium">₹{order.price}</p>
                    </div>
                  </div>
                ))}
                {orders.length > 5 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/orders")}
                  >
                    View All Orders ({orders.length})
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
                <Button className="mt-3" onClick={() => navigate("/suppliers")}>
                  Start Shopping
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="lg"
              onClick={() => navigate("/suppliers")}
            >
              <Package className="w-5 h-5 mr-3" />
              Browse Suppliers
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="lg"
              onClick={() => toast({ title: "Support", description: "Contact support at support@hopeshopper.com" })}
            >
              <Headphones className="w-5 h-5 mr-3" />
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground" 
              size="lg"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
