import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Play, Pause, Target, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface JapSession {
  mantra: string;
  count: number;
  target: number;
  startTime: number;
  lastUpdated: number;
}

const defaultMantras = [
  "ॐ नमः शिवाय",
  "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे, हरे राम हरे राम राम राम हरे हरे",
  "ॐ गं गणपतये नमः",
  "ॐ नमो भगवते वासुदेवाय",
  "राम राम राम राम",
  "सीता राम",
  "जय श्री राम",
  "ॐ श्री गणेशाय नमः",
];

const targetOptions = [
  { value: 21, label: "21" },
  { value: 108, label: "108" },
  { value: 216, label: "216" },
  { value: 432, label: "432" },
  { value: 1080, label: "1080" },
  { value: -1, label: "Infinite" },
];

export default function NaamJap() {
  const [selectedMantra, setSelectedMantra] = useState<string>("");
  const [customMantra, setCustomMantra] = useState<string>("");
  const [currentSession, setCurrentSession] = useState<JapSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState<number>(0);

  useEffect(() => {
    // Load saved session from localStorage
    const savedSession = localStorage.getItem("japSession");
    if (savedSession) {
      const session: JapSession = JSON.parse(savedSession);
      setCurrentSession(session);
      setSelectedMantra(session.mantra);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && currentSession) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
        setSessionTime(elapsed);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentSession]);

  const startSession = (target: number) => {
    const mantra = customMantra || selectedMantra;
    if (!mantra) return;

    const newSession: JapSession = {
      mantra,
      count: 0,
      target,
      startTime: Date.now(),
      lastUpdated: Date.now(),
    };

    setCurrentSession(newSession);
    setIsActive(true);
    setSessionTime(0);
    localStorage.setItem("japSession", JSON.stringify(newSession));
  };

  const incrementCount = () => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      count: currentSession.count + 1,
      lastUpdated: Date.now(),
    };

    setCurrentSession(updatedSession);
    localStorage.setItem("japSession", JSON.stringify(updatedSession));

    // Check if target is reached
    if (updatedSession.target > 0 && updatedSession.count >= updatedSession.target) {
      setIsActive(false);
      // Could add celebration animation or sound here
    }
  };

  const resetSession = () => {
    setCurrentSession(null);
    setIsActive(false);
    setSessionTime(0);
    localStorage.removeItem("japSession");
  };

  const pauseResume = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Naam Jap
            </h1>
            <p className="text-lg text-muted-foreground">
              Practice divine repetition with focused devotion. Set your target and begin your spiritual journey.
            </p>
          </div>

          {!currentSession ? (
            /* Setup Form */
            <Card className="card-divine">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-primary">
                  Start Your Practice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mantra Selection */}
                <div>
                  <Label className="text-base font-semibold">Select Mantra</Label>
                  <Select value={selectedMantra} onValueChange={setSelectedMantra}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a mantra" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultMantras.map((mantra, index) => (
                        <SelectItem key={index} value={mantra} className="font-devanagari">
                          {mantra}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Mantra */}
                <div>
                  <Label className="text-base font-semibold">Or Enter Custom Mantra</Label>
                  <Input
                    value={customMantra}
                    onChange={(e) => setCustomMantra(e.target.value)}
                    placeholder="Enter your custom mantra..."
                    className="font-devanagari text-center"
                  />
                </div>

                {/* Target Selection */}
                <div className="text-center">
                  <Label className="text-base font-semibold mb-4 block">Choose Your Target</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {targetOptions.map((option) => (
                      <Button
                        key={option.value}
                        onClick={() => startSession(option.value)}
                        disabled={!selectedMantra && !customMantra}
                        className="btn-sacred p-4 h-auto"
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold">{option.label}</div>
                          <div className="text-xs opacity-75">
                            {option.value === 21 && "Beginner"}
                            {option.value === 108 && "Traditional"}
                            {option.value === 1080 && "Advanced"}
                            {option.value === -1 && "Meditation"}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Active Session */
            <div className="space-y-6">
              {/* Session Stats */}
              <Card className="card-sacred">
                <CardContent className="p-8 text-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-3xl font-bold text-primary">{currentSession.count}</div>
                      <div className="text-muted-foreground">Current Count</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {currentSession.target === -1 ? "∞" : currentSession.target}
                      </div>
                      <div className="text-muted-foreground">Target</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">{formatTime(sessionTime)}</div>
                      <div className="text-muted-foreground">Session Time</div>
                    </div>
                  </div>

                  {/* Progress */}
                  {currentSession.target > 0 && (
                    <div className="mt-6">
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((currentSession.count / currentSession.target) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {Math.round((currentSession.count / currentSession.target) * 100)}% Complete
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mantra Display */}
              <Card className="card-divine">
                <CardContent className="p-8 text-center">
                  <div className="mantra-text mb-6 animate-om-pulse">
                    {currentSession.mantra}
                  </div>
                  
                  {/* Counter Button */}
                  <Button
                    onClick={incrementCount}
                    className="btn-divine text-2xl p-8 w-full md:w-auto min-w-[200px] mb-4"
                    disabled={!isActive && currentSession.target > 0 && currentSession.count >= currentSession.target}
                  >
                    {currentSession.target > 0 && currentSession.count >= currentSession.target 
                      ? "🎉 Completed!" 
                      : "Jap +1"
                    }
                  </Button>

                  {/* Session Status */}
                  <div className="flex justify-center items-center gap-2 mb-4">
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {isActive ? "Active" : "Paused"}
                    </Badge>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button onClick={pauseResume} variant="outline">
                      {isActive ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </>
                      )}
                    </Button>
                    
                    <Button onClick={resetSession} variant="outline">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}