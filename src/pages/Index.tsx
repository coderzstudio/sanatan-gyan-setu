import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Loader2, Users, Globe, Shield, Share2 } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { dataService } from "@/utils/dataService";
import { cache } from "@/utils/cache";

interface Book {
  id: string;
  title: string;
  language: string;
  image_url?: string;
  category: {
    name: string;
  };
}

interface Mantra {
  id: string;
  title: string;
  deity: string;
  category: string;
}

export default function Index() {
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [recentlyViewedBooks, setRecentlyViewedBooks] = useState<Book[]>([]);
  const [recentMantras, setRecentMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([
      fetchRecentBooks(),
      fetchRecentlyViewedBooks(),
      fetchRecentMantras()
    ]).finally(() => setLoading(false));
  }, []);

  const fetchRecentBooks = async () => {
    try {
      const books = await dataService.fetchRecentBooks(10);
      setRecentBooks(books);
    } catch (error) {
      console.error("Error fetching recent books:", error);
    }
  };

  const fetchRecentMantras = async () => {
    try {
      const mantras = await dataService.fetchRecentMantras(8);
      setRecentMantras(mantras);
    } catch (error) {
      console.error("Error fetching recent mantras:", error);
    }
  };

  const fetchRecentlyViewedBooks = async () => {
    const recentBookIds = JSON.parse(localStorage.getItem("recentBooks") || "[]");
    if (recentBookIds.length === 0) return;

    try {
      const books = await Promise.all(
        recentBookIds.slice(0, 6).map(async (id: string) => {
          return await dataService.fetchBookDetail(id);
        })
      );
      setRecentlyViewedBooks(books.filter(Boolean) as Book[]);
    } catch (error) {
      console.error("Error fetching recently viewed books:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <HeroSlider />
      </section>


      <div className="container mx-auto px-4 pb-8">
        {/* Recently Viewed Books */}
        {recentlyViewedBooks.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Recently Viewed</h2>
              <Link to="/books">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {recentlyViewedBooks.map((book) => (
                <Link key={book.id} to={`/book/${book.id}`} className="flex-shrink-0">
                <Card className="card-divine w-40 h-64 hover:scale-105 transition-transform">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="h-36 bg-gradient-saffron rounded-t-lg relative overflow-hidden flex-shrink-0">
                        {book.image_url ? (
                          <img
                            src={book.image_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 flex-1 flex flex-col justify-between">
                        <h3 className="font-semibold text-xs mb-1 line-clamp-2 h-10">
                          {book.title}
                        </h3>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="text-xs w-fit h-5">
                            {book.category?.name}
                          </Badge>
                          <Badge variant="outline" className="text-xs w-fit h-5">
                            {book.language}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Books */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Popular Books</h2>
            <Link to="/books">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {recentBooks.map((book) => (
              <Link key={book.id} to={`/book/${book.id}`} className="flex-shrink-0">
                <Card className="card-divine w-40 h-64 hover:scale-105 transition-transform">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="h-32 bg-gradient-saffron rounded-t-lg relative overflow-hidden flex-shrink-0">
                      {book.image_url ? (
                        <img
                          src={book.image_url}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 flex-1 flex flex-col justify-between overflow-hidden">
                      <h3 className="font-semibold text-xs mb-1 truncate">
                        {book.title}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <Badge variant="secondary" className="text-xs w-fit h-5 truncate max-w-full">
                          {book.category?.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs w-fit h-5 truncate max-w-full">
                          {book.language}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Mantras */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Popular Mantras</h2>
            <Link to="/mantras">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {recentMantras.map((mantra) => (
              <Link key={mantra.id} to={`/mantra/${mantra.id}`} className="flex-shrink-0">
                <Card className="card-divine w-36 h-56 hover:scale-105 transition-transform">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="h-36 bg-gradient-divine rounded-t-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-center">
                        <div className="text-2xl font-devanagari text-primary mb-1">ॐ</div>
                        <div className="text-sm font-medium text-primary">{mantra.deity}</div>
                      </div>
                    </div>
                    <div className="p-2 flex-1 flex flex-col justify-between">
                      <h3 className="font-semibold text-xs mb-1 line-clamp-2 h-8">
                        {mantra.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs w-fit h-5">
                        {mantra.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="card-sacred text-center">
              <CardContent className="p-4">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary mb-1">1000+</div>
                <div className="text-xs text-muted-foreground">Books</div>
              </CardContent>
            </Card>
            
            <Card className="card-sacred text-center">
              <CardContent className="p-4">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary mb-1">50K+</div>
                <div className="text-xs text-muted-foreground">Readers</div>
              </CardContent>
            </Card>
            
            <Card className="card-sacred text-center">
              <CardContent className="p-4">
                <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary mb-1">8+</div>
                <div className="text-xs text-muted-foreground">Languages</div>
              </CardContent>
            </Card>
            
            <Card className="card-sacred text-center">
              <CardContent className="p-4">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <div className="text-xs text-muted-foreground">Free</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section>
          <Card className="card-divine">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-primary mb-3">Welcome to Sanatani Gyan</h3>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                Your place to find old Hindu wisdom and spiritual knowledge. 
                Read real books, mantras, and spiritual guides that have 
                helped people for thousands of years.
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => navigator.share?.({ title: "Sanatani Gyan", url: window.location.origin })}
                  className="btn-divine text-sm"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Link to="/books">
                  <Button className="btn-sacred text-sm">
                    Start Reading
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
}
