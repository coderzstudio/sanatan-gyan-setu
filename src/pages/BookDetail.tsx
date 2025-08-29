import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Loader2, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dataService } from "@/utils/dataService";
import { cache } from "@/utils/cache";

interface Book {
  id: string;
  title: string;
  description?: string;
  author?: string;
  language: string;
  image_url?: string;
  pdf_link?: string;
  category: {
    name: string;
    description?: string;
  };
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchBook(id);
      addToRecentlyViewed(id);
    }
  }, [id]);

  const fetchBook = async (bookId: string) => {
    try {
      const bookData = await dataService.fetchBookDetail(bookId);
      setBook(bookData);
      
      // Pre-fetch related books from same category in background
      if (bookData?.category) {
        const categoryBooks = await dataService.fetchBooksByCategory(
          (bookData as any).category_id, 
          4
        );
        setRelatedBooks(categoryBooks.filter(b => b.id !== bookId));
      }
    } catch (error) {
      console.error("Error fetching book:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToRecentlyViewed = (bookId: string) => {
    const recentBooks = JSON.parse(localStorage.getItem("recentBooks") || "[]");
    const updatedBooks = [bookId, ...recentBooks.filter((id: string) => id !== bookId)].slice(0, 10);
    localStorage.setItem("recentBooks", JSON.stringify(updatedBooks));
  };

  const handleReadBook = () => {
    if (book?.pdf_link) {
      // Create a new window with proper PDF viewer
      const pdfWindow = window.open('', '_blank');
      if (pdfWindow) {
        pdfWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${book.title} - PDF Viewer</title>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body { 
                  margin: 0; 
                  padding: 0; 
                  background: #f5f5f5; 
                  font-family: Arial, sans-serif;
                  overflow: hidden;
                }
                .pdf-container {
                  width: 100vw;
                  height: 100vh;
                  display: flex;
                  flex-direction: column;
                }
                .header {
                  background: #333;
                  color: white;
                  padding: 10px 20px;
                  font-size: 18px;
                  flex-shrink: 0;
                  z-index: 1000;
                }
                .pdf-viewer {
                  flex: 1;
                  border: none;
                  background: white;
                  width: 100%;
                  height: calc(100vh - 50px);
                  position: absolute;
                  top: 50px;
                  left: 0;
                  right: 0;
                  bottom: 0;
                }
                .fallback {
                  padding: 20px;
                  text-align: center;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  z-index: 1001;
                }
                .fallback a {
                  color: #ff6b35;
                  text-decoration: none;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="pdf-container">
                <div class="header">
                  ${book.title}
                </div>
                <iframe 
                  class="pdf-viewer" 
                  src="${book.pdf_link}#toolbar=1&navpanes=1&scrollbar=1&view=FitH"
                  type="application/pdf"
                  frameborder="0"
                  allowfullscreen
                  onload="this.style.opacity=1"
                  onerror="showFallback()"
                >
                </iframe>
                <div id="fallback" class="fallback" style="display: none;">
                  <h3>PDF viewer not supported</h3>
                  <p><a href="${book.pdf_link}" target="_blank">Click here to download the PDF</a></p>
                </div>
              </div>
              <script>
                function showFallback() {
                  document.querySelector('.pdf-viewer').style.display = 'none';
                  document.getElementById('fallback').style.display = 'block';
                }
                
                // Alternative PDF loading with Mozilla PDF.js viewer
                window.addEventListener('load', function() {
                  const iframe = document.querySelector('.pdf-viewer');
                  setTimeout(() => {
                    if (!iframe.contentWindow || iframe.contentWindow.location.href === 'about:blank') {
                      // Try Mozilla PDF.js viewer (no login required)
                      iframe.src = 'https://mozilla.github.io/pdf.js/web/viewer.html?file=' + encodeURIComponent('${book.pdf_link}');
                    }
                  }, 2000);
                });
              </script>
            </body>
          </html>
        `);
        pdfWindow.document.close();
      }
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

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Book not found</h1>
          <Link to="/books">
            <Button className="btn-divine">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/books" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Image */}
          <div className="lg:col-span-1">
            <Card className="card-divine">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-gradient-saffron rounded-lg relative overflow-hidden">
                  {book.image_url ? (
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-24 w-24 text-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Read Button */}
            <Button
              onClick={handleReadBook}
              disabled={!book.pdf_link}
              className="btn-divine w-full mt-4 text-lg py-3"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Read Book
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Title and Category */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="default" className="text-sm">
                    {book.category?.name}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {book.language}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {book.title}
                </h1>
                {book.author && (
                  <p className="text-lg text-muted-foreground">
                    by {book.author}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">About this Book</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {book.description}
                </p>
              </div>

              {/* Category Info */}
              {book.category?.description && (
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Category: {book.category.name}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {book.category.description}
                  </p>
                </div>
              )}

              {/* PDF Preview */}
              {book.pdf_link && (
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Preview</h2>
                  <Card className="card-divine">
                    <CardContent className="p-4">
                      <div className="aspect-[4/3] w-full bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Click "Read Book" to view the full PDF
                          </p>
                          <Button 
                            onClick={handleReadBook}
                            className="btn-divine mt-4"
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Open PDF Reader
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}