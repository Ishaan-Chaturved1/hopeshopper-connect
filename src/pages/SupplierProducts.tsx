
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Plus, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SupplierProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'supplier') {
      navigate("/supplier-login");
    }
  }, [user, navigate]);

  if (!user || user.role !== 'supplier') {
    return null;
  }

  // Sample products based on supplier type
  const getSupplierProducts = () => {
    if (user.businessType === 'vegetables') {
      return [
        { id: '1', name: 'Tomatoes', price: '₹50/kg', stock: '100kg', category: 'Fresh Vegetables' },
        { id: '2', name: 'Onions', price: '₹40/kg', stock: '150kg', category: 'Fresh Vegetables' },
        { id: '3', name: 'Potatoes', price: '₹30/kg', stock: '200kg', category: 'Fresh Vegetables' },
        { id: '4', name: 'Carrots', price: '₹60/kg', stock: '80kg', category: 'Fresh Vegetables' },
      ];
    } else if (user.businessType === 'spices') {
      return [
        { id: '1', name: 'Turmeric', price: '₹200/kg', stock: '50kg', category: 'Spices' },
        { id: '2', name: 'Red Chili', price: '₹300/kg', stock: '40kg', category: 'Spices' },
        { id: '3', name: 'Cumin', price: '₹400/kg', stock: '30kg', category: 'Spices' },
        { id: '4', name: 'Coriander', price: '₹250/kg', stock: '60kg', category: 'Spices' },
      ];
    }
    return [];
  };

  const [products] = useState(getSupplierProducts());

  const handleAddProduct = () => {
    toast({
      title: "Add Product",
      description: "Product management feature coming soon!",
    });
  };

  const handleEditProduct = (productId: string) => {
    toast({
      title: "Edit Product",
      description: `Editing product ${productId}`,
    });
  };

  const handleDeleteProduct = (productId: string) => {
    toast({
      title: "Delete Product",
      description: `Product ${productId} deleted`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-success text-success-foreground p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/supplier-dashboard")}
            className="text-success-foreground hover:bg-success-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">My Products</h1>
            <p className="opacity-90">Manage your product inventory</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Add Product Button */}
        <Card>
          <CardContent className="p-4">
            <Button onClick={handleAddProduct} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {product.category}
                    </Badge>
                  </div>
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="font-semibold">{product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Stock:</span>
                    <span className="font-semibold">{product.stock}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditProduct(product.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Products Message */}
        {products.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first product to start selling
              </p>
              <Button onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupplierProducts;
