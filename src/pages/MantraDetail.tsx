import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        audio.src = "";
      }
    };
  }, [id]);

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
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      const newAudio = new Audio(mantra.audio_url);
      newAudio.addEventListener("ended", () => setIsPlaying(false));
      newAudio.addEventListener("error", () => {
        console.error("Error playing audio");
        setIsPlaying(false);
      });
      
      setAudio(newAudio);
      newAudio.play();
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

  return (
    <div className="min-h-screen bg-background">
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
                <div className="mantra-text mb-6 p-6 bg-gradient-divine rounded-lg">
                  {mantra.mantra_text}
                </div>
                
                {/* Meaning */}
                {mantra.meaning && (
                  <div className="mantra-meaning">
                    <h3 className="text-xl font-semibold mb-3 text-primary">Meaning</h3>
                    <p className="text-lg leading-relaxed max-w-3xl mx-auto">
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

              {/* Benefits/Instructions */}
              <div className="bg-gradient-divine rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary text-center">
                  How to Practice
                </h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>• Find a quiet, clean space for your practice</p>
                  <p>• Sit comfortably with your back straight</p>
                  <p>• Close your eyes and take a few deep breaths</p>
                  <p>• Chant the mantra with devotion and focus</p>
                  <p>• Repeat 108 times using a mala (prayer beads) if available</p>
                  <p>• Practice regularly for maximum spiritual benefit</p>
                </div>
              </div>

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