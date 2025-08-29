import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";

interface Mantra {
  id: string;
  title: string;
  deity: string;
  mantra_text: string;
  meaning: string;
  category: string;
}

const defaultDeityCategories = [
  "All",
  "Krishna",
  "Shiva",
  "Ganesh",
  "Devi",
  "Vishnu",
  "Rama",
  "Hanuman",
];

export default function Mantras() {
  const [allMantras, setAllMantras] = useState<Mantra[]>([]);
  const [filteredMantras, setFilteredMantras] = useState<Mantra[]>([]);
  const [selectedDeity, setSelectedDeity] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deityCategories, setDeityCategories] = useState<string[]>(defaultDeityCategories);

  useEffect(() => {
    fetchMantras();
    
    // Load deities from localStorage if available
    const savedDeities = localStorage.getItem('deity_categories');
    if (savedDeities) {
      setDeityCategories(JSON.parse(savedDeities));
    }
  }, []);

  useEffect(() => {
    filterMantras();
  }, [allMantras, selectedDeity, searchQuery]);

  const fetchMantras = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from("mantras")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching mantras:", error);
    } else {
      setAllMantras(data || []);
      
      // Extract unique deities and save to localStorage
      if (data && data.length > 0) {
        const uniqueDeities = ["All", ...Array.from(new Set(data.map(mantra => mantra.deity)))];
        setDeityCategories(uniqueDeities);
        localStorage.setItem('deity_categories', JSON.stringify(uniqueDeities));
      }
    }
    
    setLoading(false);
  };

  const filterMantras = () => {
    let filtered = allMantras;

    // Filter by deity
    if (selectedDeity !== "All") {
      filtered = filtered.filter(mantra => mantra.deity === selectedDeity);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(mantra => 
        mantra.title.toLowerCase().includes(query) ||
        mantra.deity.toLowerCase().includes(query) ||
        mantra.mantra_text.toLowerCase().includes(query) ||
        mantra.meaning?.toLowerCase().includes(query) ||
        mantra.category?.toLowerCase().includes(query)
      );
    }

    setFilteredMantras(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        

        {/* Search Bar */}
        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Search mantras, deities, or meanings..."
          className="mb-8"
        />

        {/* Deity Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {deityCategories.map((deity) => (
            <Button
              key={deity}
              variant={selectedDeity === deity ? "default" : "outline"}
              onClick={() => setSelectedDeity(deity)}
              className="mb-2"
            >
              {deity}
            </Button>
          ))}
        </div>

        {/* Mantras Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {filteredMantras.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No mantras found</h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords or selecting a different deity.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground text-center">
                    Showing {filteredMantras.length} mantras
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMantras.map((mantra) => (
                    <Link key={mantra.id} to={`/mantra/${mantra.id}`}>
                      <Card className="card-divine h-full hover:scale-105 transition-transform">
                        <CardContent className="p-6">
                          <div className="text-center mb-4">
                            <div className="text-3xl font-devanagari text-primary mb-2">ॐ</div>
                            <Badge variant="secondary" className="mb-2">
                              {mantra.deity}
                            </Badge>
                            {mantra.category && (
                              <Badge variant="outline" className="ml-2">
                                {mantra.category}
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-3 text-center line-clamp-2">
                            {mantra.title}
                          </h3>
                          
                          <div className="mantra-text text-lg mb-3 line-clamp-2">
                            {mantra.mantra_text}
                          </div>
                          
                          {mantra.meaning && (
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {mantra.meaning}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
