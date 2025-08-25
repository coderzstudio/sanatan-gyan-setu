import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import hero images
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";

const heroImages = [
  {
    src: hero1,
    title: "Lord Krishna's Divine Teachings",
    subtitle: "Explore the sacred wisdom of Bhagavad Gita",
  },
  {
    src: hero2,
    title: "Ramayana - The Epic Journey",
    subtitle: "Discover the path of righteousness and devotion",
  },
  {
    src: hero3,
    title: "Shiva's Eternal Wisdom",
    subtitle: "Dive deep into the mysteries of existence",
  },
  {
    src: hero4,
    title: "Goddess Saraswati's Blessings",
    subtitle: "Seek knowledge and enlightenment",
  },
  {
    src: hero5,
    title: "Ancient Sanskrit Literature",
    subtitle: "Preserve and explore timeless wisdom",
  },
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? heroImages.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === heroImages.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-lg">
      {/* Image Container */}
      <div className="relative w-full h-full">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.src}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div className="max-w-4xl px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-divine-fade">
                  {image.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 animate-sacred-slide">
                  {image.subtitle}
                </p>
                <Button className="btn-divine text-lg px-8 py-3">
                  Explore Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow Navigation */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}