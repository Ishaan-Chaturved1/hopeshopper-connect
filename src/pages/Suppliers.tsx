
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Star, MapPin, Phone, MessageCircle, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Suppliers = () => {
  const navigate = useNavigate();
  const { suppliers, sendMessage } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Suppliers" },
    { id: "vegetables", name: "Vegetables" },
    { id: "spices", name: "Spices" },
    { id: "grains", name: "Grains" },
    { id: "dairy", name: "Dairy" }
  ];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.materials.some(material => 
                           material.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = selectedCategory === "all" || supplier.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContact = (supplier: any) => {
    sendMessage(supplier.id, `Hi ${supplier.name}, I'm interested in your products. Can you share your current rates?`);
    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${supplier.name}.`,
    });
    navigate("/chat");
  };

  const handleRequestQuote = (supplier: any) => {
    sendMessage(supplier.id, `Hello ${supplier.name}, I would like to request a quote for bulk purchases. Please share your best rates and minimum quantities.`);
    toast({
      title: "Quote Requested!",
      description: `Quote request sent to ${supplier.name}.`,
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
            onClick={() => navigate("/dashboard")}
            className="text-success-foreground hover:bg-success-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Verified Suppliers</h1>
            <p className="opacity-90">Find the best suppliers for your business</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search suppliers or materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-custom-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-success flex items-center justify-center">
                    <span className="text-success-foreground font-bold text-lg">
                      {supplier.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{supplier.rating}</span>
                      <MapPin className="w-4 h-4 ml-2" />
                      <span>{supplier.distance}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-primary mb-2">Materials:</p>
                  <div className="flex flex-wrap gap-1">
                    {supplier.materials.map((material, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="font-medium text-success">Price Range: {supplier.price}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleContact(supplier)}
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleRequestQuote(supplier)}
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Quote
                  </Button>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{supplier.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No suppliers found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
