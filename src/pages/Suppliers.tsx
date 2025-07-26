
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Star, MapPin, Phone, MessageCircle, ShoppingCart, CheckCircle, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Suppliers = () => {
  const navigate = useNavigate();
  const { suppliers, sendMessage, searchSuppliers } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [contactingSupplier, setContactingSupplier] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "All Suppliers", count: suppliers.length },
    { id: "vegetables", name: "Vegetables", count: suppliers.filter(s => s.category === "vegetables").length },
    { id: "spices", name: "Spices", count: suppliers.filter(s => s.category === "spices").length },
    { id: "grains", name: "Grains", count: suppliers.filter(s => s.category === "grains").length },
    { id: "dairy", name: "Dairy", count: suppliers.filter(s => s.category === "dairy").length }
  ];

  // Debounced search with instant filtering
  const filteredSuppliers = useMemo(() => {
    return searchSuppliers(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory, suppliers, searchSuppliers]);

  // Handle search input with immediate response
  const handleSearchChange = (value: string) => {
    setIsSearching(true);
    setSearchTerm(value);
    
    // Clear searching state after a short delay
    setTimeout(() => setIsSearching(false), 200);
  };

  const handleContact = async (supplier: any) => {
    setContactingSupplier(supplier.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      sendMessage(supplier.id, `Hi ${supplier.name}, I'm interested in your products. Can you share your current rates?`);
      
      toast({
        title: "Message Sent Successfully!",
        description: `Your message has been sent to ${supplier.name}. They will respond soon.`,
      });
      
      // Navigate to chat after a brief delay
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } finally {
      setContactingSupplier(null);
    }
  };

  const handleRequestQuote = async (supplier: any) => {
    setContactingSupplier(supplier.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      sendMessage(supplier.id, `Hello ${supplier.name}, I would like to request a quote for bulk purchases. Please share your best rates and minimum quantities.`);
      
      toast({
        title: "Quote Requested Successfully!",
        description: `Quote request sent to ${supplier.name}. You'll receive their response shortly.`,
      });
    } finally {
      setContactingSupplier(null);
    }
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Verified Suppliers</h1>
            <p className="opacity-90">Find the best suppliers in your area • {filteredSuppliers.length} suppliers found</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Enhanced Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
              isSearching ? 'text-primary animate-pulse' : 'text-muted-foreground'
            }`} />
            <Input
              placeholder="Search by supplier name, materials, or location..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 focus:border-primary transition-all duration-200"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSearchChange("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ✕
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by category:</span>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all duration-200"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {searchTerm && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              {filteredSuppliers.length > 0 
                ? `Found ${filteredSuppliers.length} supplier${filteredSuppliers.length === 1 ? '' : 's'} matching "${searchTerm}"`
                : `No suppliers found matching "${searchTerm}"`
              }
            </p>
          </div>
        )}

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-success flex items-center justify-center relative">
                    <span className="text-success-foreground font-bold text-xl">
                      {supplier.name.charAt(0)}
                    </span>
                    {supplier.verified && (
                      <CheckCircle className="w-4 h-4 bg-success text-success-foreground rounded-full absolute -top-1 -right-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {supplier.name}
                      {supplier.verified && <Badge variant="secondary" className="text-xs">Verified</Badge>}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{supplier.rating}</span>
                      <MapPin className="w-4 h-4 ml-2" />
                      <span>{supplier.distance}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-primary mb-2">Location:</p>
                  <p className="text-sm text-muted-foreground">{supplier.location}</p>
                </div>

                <div>
                  <p className="font-medium text-primary mb-2">Materials:</p>
                  <div className="flex flex-wrap gap-1">
                    {supplier.materials.slice(0, 4).map((material, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                    {supplier.materials.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{supplier.materials.length - 4} more
                      </Badge>
                    )}
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
                    disabled={contactingSupplier === supplier.id}
                    className="flex-1 transition-all duration-200"
                  >
                    {contactingSupplier === supplier.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Contact
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleRequestQuote(supplier)}
                    disabled={contactingSupplier === supplier.id}
                    className="flex-1 transition-all duration-200"
                  >
                    {contactingSupplier === supplier.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Quote
                      </>
                    )}
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

        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">No suppliers found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `Try adjusting your search term "${searchTerm}" or filter criteria to find more suppliers.`
                : "Try adjusting your filter criteria to find suppliers in your area."
              }
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
