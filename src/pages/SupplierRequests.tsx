
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Package, MapPin, CheckCircle, XCircle, Truck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SupplierRequests = () => {
  const navigate = useNavigate();
  const { user, getSupplierRequests, updateRequestStatus } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState(() => 
    user ? getSupplierRequests(user.id) : []
  );

  useEffect(() => {
    if (!user || user.role !== 'supplier') {
      navigate("/supplier-login");
    }
  }, [user, navigate]);

  if (!user || user.role !== 'supplier') {
    return null;
  }

  const handleStatusUpdate = (requestId: string, status: 'accepted' | 'rejected' | 'delivered') => {
    updateRequestStatus(requestId, status);
    setRequests(getSupplierRequests(user.id));
    
    const statusMessages = {
      accepted: "Request accepted successfully!",
      rejected: "Request rejected.",
      delivered: "Order marked as delivered!"
    };
    
    toast({
      title: "Status Updated",
      description: statusMessages[status],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success text-success-foreground';
      case 'accepted': return 'bg-primary text-primary-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-warning text-warning-foreground';
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const acceptedRequests = requests.filter(req => req.status === 'accepted');
  const completedRequests = requests.filter(req => req.status === 'delivered');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-warning text-warning-foreground p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/supplier-dashboard")}
            className="text-warning-foreground hover:bg-warning-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Material Requests</h1>
            <p className="opacity-90">Manage incoming vendor requests</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning-light rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                  <p className="text-2xl font-bold">{acceptedRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-light rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">{completedRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                New Requests ({pendingRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 bg-warning-light">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{request.vendorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span>{request.material} - {request.quantity}kg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Delivery: {new Date(request.deliveryDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{request.deliveryAddress}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => handleStatusUpdate(request.id, 'accepted')}
                          className="bg-success hover:bg-success/90"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accepted Requests */}
        {acceptedRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Accepted Orders ({acceptedRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {acceptedRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 bg-primary-light">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{request.vendorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span>{request.material} - {request.quantity}kg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Delivery: {new Date(request.deliveryDate).toLocaleDateString()}</span>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleStatusUpdate(request.id, 'delivered')}
                        className="bg-success hover:bg-success/90"
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Mark as Delivered
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Requests */}
        {completedRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Completed Orders ({completedRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 bg-success-light">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{request.vendorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span>{request.material} - {request.quantity}kg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Delivered: {new Date(request.deliveryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        Delivered
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Requests Message */}
        {requests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
              <p className="text-muted-foreground">
                New material requests from vendors will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupplierRequests;
