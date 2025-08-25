import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Mantra {
  id: string;
  title: string;
  deity: string;
  mantra_text: string;
  meaning: string;
  category: string;
}

const deityCategories = [
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
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [selectedDeity, setSelectedDeity] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMantras();
  }, [selectedDeity]);

  const fetchMantras = async () => {
    setLoading(true);
    
    let query = supabase
      .from("mantras")
      .select("*")
      .order("title");

    if (selectedDeity !== "All") {
      query = query.eq("deity", selectedDeity);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching mantras:", error);
    } else {
      setMantras(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Sacred Mantras
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the power of divine sound through our collection of sacred mantras. 
            Each mantra carries the essence of spiritual transformation and inner peace.
          </p>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mantras.map((mantra) => (
              <Link key={mantra.id} to={`/mantra/${mantra.id}`}>
                <Card className="card-divine h-full hover:scale-105 transition-transform">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      {/* Deity Badge */}
                      <Badge variant="default" className="mb-2">
                        {mantra.deity}
                      </Badge>
                      
                      {/* Title */}
                      <h3 className="font-semibold text-xl text-primary">
                        {mantra.title}
                      </h3>
                      
                      {/* Mantra Text (truncated) */}
                      <div className="font-devanagari text-lg text-center text-primary-deep leading-relaxed">
                        {mantra.mantra_text.length > 50 
                          ? `${mantra.mantra_text.substring(0, 50)}...`
                          : mantra.mantra_text
                        }
                      </div>
                      
                      {/* Meaning (truncated) */}
                      <p className="text-muted-foreground text-sm italic">
                        {mantra.meaning && mantra.meaning.length > 80 
                          ? `${mantra.meaning.substring(0, 80)}...`
                          : mantra.meaning
                        }
                      </p>
                      
                      {/* View Details Button */}
                      <Button variant="outline" className="mt-4">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {mantras.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-4xl font-devanagari text-primary mb-4">ॐ</div>
            <h3 className="text-xl font-semibold mb-2">No mantras found</h3>
            <p className="text-muted-foreground">
              Try selecting a different deity or check back later.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}