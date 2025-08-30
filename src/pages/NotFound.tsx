import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Page Not Found - 404 Error | Sanatani Gyan"
        description="The page you're looking for doesn't exist. Return to our homepage to explore Hindu scriptures, mantras, and spiritual wisdom."
        url={`https://sanatanigyan.netlify.app${location.pathname}`}
        noindex={true}
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="card-divine">
            <CardContent className="p-12">
              <div className="text-8xl font-bold text-primary mb-6">404</div>
              <h1 className="text-3xl font-bold mb-4 text-primary">
                Page Not Found
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                The page you're looking for doesn't exist. It might have been moved, 
                deleted, or you entered the wrong URL.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button className="btn-divine">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                </Link>
                <Link to="/books">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Books
                  </Button>
                </Link>
                <Link to="/mantras">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    <Search className="mr-2 h-4 w-4" />
                    Explore Mantras
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-muted-foreground italic">
                  "When lost, remember the divine path leads home."
                </p>
                <p className="text-primary font-devanagari text-xl mt-2">
                  ॐ शान्ति शान्ति शान्तिः
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
