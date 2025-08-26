import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Globe, Shield, Share2, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";

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
  category?: string;
}

export default function Index() {
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [topBooks, setTopBooks] = useState<Book[]>([]);
  const [topMantras, setTopMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBooks();
    fetchTopBooks();
    fetchTopMantras();
  }, []);

  const fetchRecentBooks = async () => {
    const recentIds = JSON.parse(localStorage.getItem("recentBooks") || "[]");
    if (recentIds.length === 0) return;

    const { data } = await supabase
      .from("books")
      .select("id, title, language, image_url, category:categories(name)")
      .in("id", recentIds.slice(0, 10));

    if (data) {
      setRecentBooks(data);
    }
  };

  const fetchTopBooks = async () => {
    const { data } = await supabase
      .from("books")
      .select("id, title, language, image_url, category:categories(name)")
      .limit(10)
      .order("created_at", { ascending: false });

    if (data) {
      setTopBooks(data);
    }
    setLoading(false);
  };

  const fetchTopMantras = async () => {
    const { data } = await supabase
      .from("mantras")
      .select("id, title, deity, category")
      .limit(8)
      .order("created_at", { ascending: false });

    if (data) {
      setTopMantras(data);
    }
  };

  const shareWebsite = () => {
    if (navigator.share) {
      navigator.share({
        title: "Sanatani Gyan Library",
        text: "Discover ancient Vedic wisdom and sacred texts",
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Slider */}
      <section className="container mx-auto px-4 py-8">
        <HeroSlider />
      </section>

      {/* Recently Viewed */}
      {recentBooks.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-primary flex items-center">
              <Clock className="mr-3 h-8 w-8" />
              Recently Viewed
            </h2>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide">
            {recentBooks.map((book) => (
              <Link key={book.id} to={`/book/${book.id}`} className="flex-none">
                <Card className="card-divine hover:scale-105 transition-transform w-32 sm:w-36">
                  <CardContent className="p-3">
                    <div className="aspect-[3/4] bg-gradient-saffron rounded mb-2 flex items-center justify-center">
                      {book.image_url ? (
                        <img src={book.image_url} alt={book.title} className="w-full h-full object-cover rounded" />
                      ) : (
                        <BookOpen className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <h3 className="font-medium text-xs line-clamp-2 mb-1 h-8">{book.title}</h3>
                    <Badge variant="outline" className="text-xs w-full justify-center truncate">{book.language}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Top Books */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-primary">Popular Books</h2>
          <Link to="/books">
            <Button className="btn-sacred">View All</Button>
          </Link>
        </div>
        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
          {topBooks.slice(0, 10).map((book) => (
            <Link key={book.id} to={`/book/${book.id}`} className="flex-none">
              <Card className="card-divine hover:scale-105 transition-transform w-40 sm:w-44">
                <CardContent className="p-4">
                  <div className="aspect-[3/4] bg-gradient-saffron rounded mb-3 flex items-center justify-center">
                    {book.image_url ? (
                      <img src={book.image_url} alt={book.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <BookOpen className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2 h-10">{book.title}</h3>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="w-full justify-center text-xs truncate">{book.category?.name}</Badge>
                    <Badge variant="outline" className="w-full justify-center text-xs">{book.language}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Mantras */}
      {topMantras.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-primary">Popular Mantras</h2>
            <Link to="/mantras">
              <Button className="btn-sacred">View All</Button>
            </Link>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
            {topMantras.map((mantra) => (
              <Link key={mantra.id} to={`/mantra/${mantra.id}`} className="flex-none">
                <Card className="card-divine hover:scale-105 transition-transform w-48 sm:w-52">
                  <CardContent className="p-4">
                    <div className="aspect-[4/3] bg-gradient-divine rounded mb-3 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-devanagari text-primary mb-2">ॐ</div>
                        <div className="text-lg font-medium text-primary">{mantra.deity}</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2 h-10">{mantra.title}</h3>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="w-full justify-center text-xs">{mantra.deity}</Badge>
                      {mantra.category && (
                        <Badge variant="outline" className="w-full justify-center text-xs truncate">{mantra.category}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Info Cards */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-sacred text-center">
            <CardContent className="p-6">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Sacred Texts</div>
            </CardContent>
          </Card>
          
          <Card className="card-sacred text-center">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Active Readers</div>
            </CardContent>
          </Card>
          
          <Card className="card-sacred text-center">
            <CardContent className="p-6">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">8+</div>
              <div className="text-muted-foreground">Languages</div>
            </CardContent>
          </Card>
          
          <Card className="card-sacred text-center">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Free Access</div>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="card-divine">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-primary mb-4">Welcome to Sanatani Gyan Library</h3>
            <p className="text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-6">
              Your digital gateway to Vedic knowledge and spiritual wisdom. 
              Discover authentic scriptures, mantras, and spiritual practices that have 
              guided humanity for thousands of years. From the Vedas to the Puranas, from the Bhagavad 
              Gita to the Upanishads - explore timeless teachings that show the path to 
              self-realization and spiritual growth.
            </p>
            <Button onClick={shareWebsite} className="btn-divine mr-4">
              <Share2 className="mr-2 h-4 w-4" />
              Share Library
            </Button>
            <Link to="/books">
              <Button className="btn-sacred">
                Start Exploring
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}