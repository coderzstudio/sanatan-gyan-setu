import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { dataService } from "@/utils/dataService";
import { cache } from "@/utils/cache";

interface Book {
  id: string;
  title: string;
  description?: string;
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
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryBooks, setCategoryBooks] = useState<{ [key: string]: Book[] }>({});
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);

  const LIMIT = 12;

  useEffect(() => {
    fetchCategories();
    fetchAllBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [allBooks, searchQuery]);

  const fetchCategories = async () => {
    try {
      const data = await dataService.fetchCategories() as Category[];
      setCategories(data || []);
      // Initialize all categories as open
      const initialOpenState: { [key: string]: boolean } = {};
      (data || []).forEach((category: Category) => {
        initialOpenState[category.id] = true;
      });
      setOpenCategories(initialOpenState);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAllBooks = async (offset = 0, append = false) => {
    if (offset === 0) setLoading(true);
    else setLoadingMore(true);
    
    try {
      const books = await dataService.fetchBooks({ limit: LIMIT, offset });
      
      if (append) {
        setAllBooks(prev => [...prev, ...books]);
        // Update category books with new data
        const allBooksIncludingNew = [...allBooks, ...books];
        groupBooksByCategory(allBooksIncludingNew);
      } else {
        setAllBooks(books);
        groupBooksByCategory(books);
      }
      
      setHasMore(books.length === LIMIT);
      setCurrentOffset(offset + LIMIT);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const groupBooksByCategory = (books: Book[]) => {
    const grouped: { [key: string]: Book[] } = {};
    books.forEach(book => {
      const categoryId = (book as any).category_id;
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(book);
    });
    setCategoryBooks(grouped);
  };

  const filterBooks = () => {
    if (!searchQuery.trim()) {
      setFilteredBooks(allBooks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allBooks.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.description?.toLowerCase().includes(query) ||
      book.category?.name.toLowerCase().includes(query) ||
      book.language.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Books Library
          </h1>
        </div>

        {/* Search Bar */}
        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Search books, categories, or languages..."
          className="mb-8"
        />

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : searchQuery ? (
          /* Search Results */
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">
              Search Results ({filteredBooks.length})
            </h2>
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No books found</h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
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
            )}
          </div>
        ) : (
          /* Category-based Layout */
          <div className="space-y-8">
            {categories.map((category) => {
              const booksInCategory = categoryBooks[category.id] || [];
              if (booksInCategory.length === 0) return null;

              return (
                <Collapsible
                  key={category.id}
                  open={openCategories[category.id]}
                  onOpenChange={() => toggleCategory(category.id)}
                >
                  <div className="border border-border rounded-lg p-4 card-divine">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-between text-left p-2 hover:bg-accent rounded-md"
                      >
                        <div>
                          <h2 className="text-xl font-bold text-primary">{category.name}</h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {booksInCategory.length} books
                          </p>
                        </div>
                        {openCategories[category.id] ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {booksInCategory.map((book) => (
                          <Link key={book.id} to={`/book/${book.id}`}>
                            <Card className="card-divine hover:scale-105 transition-transform h-24">
                              <CardContent className="p-3 h-full">
                                <div className="flex gap-3 h-full">
                                  <div className="w-16 h-18 bg-gradient-saffron rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    {book.image_url ? (
                                      <img
                                        src={book.image_url}
                                        alt={book.title}
                                        className="w-14 h-16 object-cover rounded m-1"
                                      />
                                    ) : (
                                      <BookOpen className="h-6 w-6 text-white" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                                      {book.title}
                                    </h3>
                                    <Badge variant="outline" className="text-xs w-fit">
                                      {book.language}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}