
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Edit, Phone, Building, LogOut, Mail, MapPin, Package, Star, Headphones } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SupplierProfile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, getSupplierOrders } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {
    id: "",
    name: "",
    phone: "",
    businessType: "",
    businessName: "",
    email: "",
    location: ""
  });

  if (!user || user.role !== 'supplier') {
    navigate("/supplier-login");
    return null;
  }

  const supplierOrders = getSupplierOrders(user.id);

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

  const completedOrders = supplierOrders.filter(order => order.status === 'delivered').length;
  const totalRevenue = supplierOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.price, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-accent text-accent-foreground p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/supplier-dashboard")}
            className="text-accent-foreground hover:bg-accent-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Supplier Profile</h1>
            <p className="opacity-90">Manage your business information</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Business Information</CardTitle>
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
              <div className="w-20 h-20 rounded-full bg-gradient-success flex items-center justify-center">
                <User className="w-10 h-10 text-success-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <p className="text-muted-foreground">{user.businessName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">4.8 Rating</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Business Owner
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter owner name"
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
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{user.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Business Name
                </Label>
                {isEditing ? (
                  <Input
                    value={editedUser.businessName}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Enter business name"
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{user.businessName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    value={editedUser.email}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{user.email || 'Not provided'}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Business Location
                </Label>
                {isEditing ? (
                  <Input
                    value={editedUser.location}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter business location"
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{user.location}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Business Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-success-light">
                <Package className="w-8 h-8 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Orders Completed</p>
                  <p className="text-2xl font-bold">{completedOrders}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-light">
                <Star className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">4.8</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-warning-light">
                <Building className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="w-5 h-5" />
              Recent Orders ({supplierOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {supplierOrders.length > 0 ? (
              <div className="space-y-3">
                {supplierOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.material}</p>
                      <p className="text-sm text-muted-foreground">
                        Vendor: {order.userId} • {new Date(order.date).toLocaleDateString()}
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
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
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
              onClick={() => navigate("/supplier-requests")}
            >
              <Package className="w-5 h-5 mr-3" />
              View All Requests
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="lg"
              onClick={() => toast({ title: "Support", description: "Contact support at supplier@hopeshopper.com" })}
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

export default SupplierProfile;
