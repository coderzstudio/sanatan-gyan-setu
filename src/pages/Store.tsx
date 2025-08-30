import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { breadcrumbStructuredData } from "@/utils/seoData";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  in_stock: boolean;
}

const categories = ["All", "Books", "Pooja Kits", "QR Cards", "Accessories"];

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    
    let query = supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .order("name");

    if (selectedCategory !== "All") {
      query = query.eq("category", selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const addToCart = (productId: string, productName: string) => {
    const updatedCart = [...cart, productId];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    toast({
      title: "Added to Cart",
      description: `${productName} has been added to your cart.`,
    });
  };

  const getCartCount = (productId: string) => {
    return cart.filter(id => id === productId).length;
  };

  const getTotalItems = () => {
    return cart.length;
  };

  const breadcrumbData = breadcrumbStructuredData([
    { name: "Home", url: "https://sanatanigyan.netlify.app/" },
    { name: "Store", url: "https://sanatanigyan.netlify.app/store" }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sacred Store - Spiritual Books, Pooja Kits & QR Cards | Sanatani Gyan"
        description="Shop authentic spiritual products including religious books, pooja kits, QR-based darshan cards, and sacred accessories. Premium quality items for your spiritual journey."
        keywords="Hindu spiritual products, pooja kits, religious books, QR darshan cards, spiritual accessories, sacred items, Hindu store, spiritual shopping"
        url="https://sanatanigyan.netlify.app/store"
        structuredData={breadcrumbData}
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Sacred Store
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover authentic spiritual products, books, and pooja essentials 
            to enhance your divine journey and daily practice.
          </p>
          
          {/* Cart Info */}
          {getTotalItems() > 0 && (
            <div className="mt-6 flex justify-center">
              <Badge variant="default" className="text-lg px-4 py-2">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {getTotalItems()} item(s) in cart
              </Badge>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="card-divine hover:scale-105 transition-transform">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-saffron relative overflow-hidden rounded-t-lg">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-16 w-16 text-white" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {product.category}
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-primary">
                        ₹{product.price}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-muted-foreground">4.8</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={() => addToCart(product.id, product.name)}
                        className="btn-divine flex-1 mr-2"
                        disabled={!product.in_stock}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      
                      {getCartCount(product.id) > 0 && (
                        <Badge variant="default" className="text-sm">
                          {getCartCount(product.id)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try selecting a different category or check back later.
            </p>
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-12 text-center">
          <Card className="card-sacred max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">
                🎉 More Features Coming Soon!
              </h3>
              <p className="text-muted-foreground mb-6">
                We're working on integrating Razorpay/Stripe for secure payments, 
                cart management, order tracking, and much more. Stay tuned for updates!
              </p>
              <Button className="btn-divine">
                Subscribe for Updates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}