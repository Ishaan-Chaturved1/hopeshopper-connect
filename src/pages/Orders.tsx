
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Package, Upload, Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const navigate = useNavigate();
  const { orders, suppliers, addOrder } = useAuth();
  const { toast } = useToast();
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    supplierId: "",
    supplierName: "",
    material: "",
    quantity: "",
    deliveryAddress: "",
    deliveryDate: "",
    paymentScreenshot: ""
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newOrder.supplierId || !newOrder.material || !newOrder.quantity || 
        !newOrder.deliveryAddress || !newOrder.deliveryDate) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const supplier = suppliers.find(s => s.id === newOrder.supplierId);
    if (!supplier) return;

    addOrder({
      supplierId: newOrder.supplierId,
      supplierName: supplier.name,
      material: newOrder.material,
      quantity: parseInt(newOrder.quantity),
      price: 150, // Sample price
      status: 'pending',
      date: new Date().toISOString(),
      deliveryAddress: newOrder.deliveryAddress,
      deliveryDate: newOrder.deliveryDate,
      paymentScreenshot: newOrder.paymentScreenshot
    });

    toast({
      title: "Order Placed Successfully!",
      description: `Your order for ${newOrder.material} has been sent to ${supplier.name}.`,
    });

    setNewOrder({
      supplierId: "",
      supplierName: "",
      material: "",
      quantity: "",
      deliveryAddress: "",
      deliveryDate: "",
      paymentScreenshot: ""
    });
    setShowNewOrder(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewOrder(prev => ({ ...prev, paymentScreenshot: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success text-success-foreground';
      case 'shipped': return 'bg-primary text-primary-foreground';
      case 'accepted': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'delivered': return 100;
      case 'shipped': return 75;
      case 'accepted': return 50;
      default: return 25;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-warning text-warning-foreground p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-warning-foreground hover:bg-warning-foreground/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Orders</h1>
              <p className="opacity-90">Manage your orders and track deliveries</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowNewOrder(true)}
            className="bg-white text-warning hover:bg-gray-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">My Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="new">Place New Order</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {orders.length > 0 ? orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.material}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        From {order.supplierName} • {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Quantity</p>
                      <p className="text-muted-foreground">{order.quantity} kg</p>
                    </div>
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-muted-foreground">₹{order.price}</p>
                    </div>
                    <div>
                      <p className="font-medium">Delivery Date</p>
                      <p className="text-muted-foreground">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Delivery Address</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{order.deliveryAddress}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Order Progress</span>
                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getStatusProgress(order.status)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Pending</span>
                      <span>Accepted</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-12">
                <Package className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">Start by placing your first order</p>
                <Button onClick={() => setShowNewOrder(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Place Your First Order
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>Place New Order</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Select Supplier</Label>
                      <Select 
                        value={newOrder.supplierId} 
                        onValueChange={(value) => {
                          const supplier = suppliers.find(s => s.id === value);
                          setNewOrder(prev => ({ 
                            ...prev, 
                            supplierId: value,
                            supplierName: supplier?.name || ""
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name} - {supplier.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        value={newOrder.material}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, material: e.target.value }))}
                        placeholder="e.g., Tomatoes, Rice, Spices"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity (kg)</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newOrder.quantity}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, quantity: e.target.value }))}
                        placeholder="Enter quantity"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryDate">Delivery Date</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={newOrder.deliveryDate}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Input
                      id="deliveryAddress"
                      value={newOrder.deliveryAddress}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      placeholder="Enter your complete delivery address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment Screenshot (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="payment"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="flex-1"
                      />
                      {newOrder.paymentScreenshot && (
                        <div className="w-20 h-20 border rounded-lg overflow-hidden">
                          <img 
                            src={newOrder.paymentScreenshot} 
                            alt="Payment screenshot" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Package className="w-4 h-4 mr-2" />
                    Place Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;
