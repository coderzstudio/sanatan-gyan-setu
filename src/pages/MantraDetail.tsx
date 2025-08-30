import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { createMantraStructuredData, breadcrumbStructuredData } from "@/utils/seoData";

interface Mantra {
  id: string;
  title: string;
  deity: string;
  mantra_text: string;
  meaning: string;
  audio_url?: string;
  category: string;
}

export default function MantraDetail() {
  const { id } = useParams<{ id: string }>();
  const [mantra, setMantra] = useState<Mantra | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (id) {
      fetchMantra(id);
    }
    
    // Cleanup audio on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setAudio(null);
      }
    };
  }, [id, audio]);

  const fetchMantra = async (mantraId: string) => {
    const { data, error } = await supabase
      .from("mantras")
      .select("*")
      .eq("id", mantraId)
      .single();

    if (error) {
      console.error("Error fetching mantra:", error);
    } else {
      setMantra(data);
    }
    setLoading(false);
  };

  const toggleAudio = () => {
    if (!mantra?.audio_url) return;

    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    } else {
      const newAudio = new Audio(mantra.audio_url);
      
      newAudio.addEventListener("loadstart", () => {
        console.log("Audio loading started");
      });
      
      newAudio.addEventListener("canplay", () => {
        console.log("Audio can start playing");
      });
      
      newAudio.addEventListener("ended", () => {
        setIsPlaying(false);
      });
      
      newAudio.addEventListener("error", (e) => {
        console.error("Audio error:", e);
        setIsPlaying(false);
      });
      
      setAudio(newAudio);
      
      newAudio.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
      
      setIsPlaying(true);
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

  if (!mantra) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title="Mantra Not Found - Sanatani Gyan"
          description="The requested mantra was not found. Explore our collection of sacred Hindu mantras and chants."
          url={`https://sanatanigyan.netlify.app/mantra/${id}`}
          noindex={true}
        />
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Mantra not found</h1>
          <Link to="/mantras">
            <Button className="btn-divine">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Mantras
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const mantraStructuredData = createMantraStructuredData(mantra);
  const breadcrumbData = breadcrumbStructuredData([
    { name: "Home", url: "https://sanatanigyan.netlify.app/" },
    { name: "Mantras", url: "https://sanatanigyan.netlify.app/mantras" },
    { name: mantra.title, url: `https://sanatanigyan.netlify.app/mantra/${mantra.id}` }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${mantra.title} - ${mantra.deity} Mantra | Sanatani Gyan`}
        description={`Sacred ${mantra.deity} mantra: ${mantra.title}. Learn the meaning, pronunciation and spiritual benefits of this powerful Sanskrit chant.`}
        keywords={`${mantra.deity} mantra, ${mantra.title}, Sanskrit chant, Hindu prayer, spiritual mantra, meditation chant, ${mantra.category}`}
        url={`https://sanatanigyan.netlify.app/mantra/${mantra.id}`}
        type="article"
        structuredData={[mantraStructuredData, breadcrumbData]}
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/mantras" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mantras
        </Link>

        <div className="max-w-4xl mx-auto">
          <Card className="card-sacred">
            <CardContent className="p-8 md:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <Badge variant="default" className="mb-4 text-lg px-4 py-2">
                  {mantra.deity}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  {mantra.title}
                </h1>
              </div>

              {/* Mantra Text */}
              <div className="text-center mb-8">
                <div className="mantra-text mb-6 p-6 bg-gradient-divine rounded-lg whitespace-pre-line">
                  {mantra.mantra_text}
                </div>
                
                {/* Meaning */}
                {mantra.meaning && (
                  <div className="mantra-meaning">
                    <h3 className="text-xl font-semibold mb-3 text-primary">Meaning</h3>
                    <p className="text-lg leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
                      {mantra.meaning}
                    </p>
                  </div>
                )}
              </div>

              {/* Audio Player */}
              {mantra.audio_url && (
                <div className="text-center mb-8">
                  <Button
                    onClick={toggleAudio}
                    className="btn-divine text-lg px-8 py-4"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Pause Chanting
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Play Chanting
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Start Naam Jap */}
              <div className="text-center mt-8">
                <Link to="/naam-jap">
                  <Button className="btn-sacred text-lg px-8 py-3">
                    Start Naam Jap Practice
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}