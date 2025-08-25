import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Book {
  id: string;
  title: string;
  description: string;
  language: string;
  image_url?: string;
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 12;

  useEffect(() => {
    fetchCategories();
    fetchBooks(0, selectedCategory);
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchBooks = async (currentOffset: number, category: string) => {
    setLoading(currentOffset === 0);
    setLoadingMore(currentOffset > 0);

    let query = supabase
      .from("books")
      .select(`
        id,
        title,
        description,
        language,
        image_url,
        category:categories(name)
      `)
      .range(currentOffset, currentOffset + LIMIT - 1)
      .order("created_at", { ascending: false });

    if (category !== "all") {
      query = query.eq("categories.name", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching books:", error);
    } else {
      if (currentOffset === 0) {
        setBooks(data || []);
      } else {
        setBooks(prev => [...prev, ...(data || [])]);
      }
      setHasMore((data || []).length === LIMIT);
      setOffset(currentOffset + LIMIT);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setOffset(0);
    setHasMore(true);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchBooks(offset, selectedCategory);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Sacred Library
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our vast collection of ancient Vedic texts, scriptures, 
            and spiritual literature from the Sanatani tradition.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => handleCategoryChange("all")}
            className="mb-2"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.name)}
              className="mb-2"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {books.map((book) => (
                <Link key={book.id} to={`/book/${book.id}`}>
                  <Card className="card-divine h-full hover:scale-105 transition-transform">
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] bg-gradient-saffron rounded-t-lg relative overflow-hidden">
                        {book.image_url ? (
                          <img
                            src={book.image_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {book.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {book.category?.name}
                          </Badge>
                          <Badge variant="outline">
                            {book.language}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn-divine"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Books"
                  )}
                </Button>
              </div>
            )}

            {books.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No books found</h3>
                <p className="text-muted-foreground">
                  Try selecting a different category or check back later.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}