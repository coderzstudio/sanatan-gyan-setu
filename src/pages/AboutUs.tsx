import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Heart, Target, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            About Sanatani Gyan Library
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Preserving ancient wisdom for modern seekers. Our mission is to make 
            sacred Vedic knowledge accessible to everyone, everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Mission */}
          <Card className="card-divine">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To create a comprehensive digital repository of Sanatani literature, 
                scriptures, and spiritual knowledge that serves as a bridge between 
                ancient wisdom and contemporary learning. We strive to make these 
                timeless teachings freely accessible to spiritual seekers worldwide, 
                fostering a deeper understanding of Dharma and self-realization.
              </p>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="card-divine">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-primary">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To become the world's most trusted and comprehensive platform for 
                Vedic and Sanatani knowledge, where every seeker can find authentic 
                texts, guided practices, and spiritual tools for their journey. 
                We envision a global community united by timeless wisdom and 
                universal values of truth, compassion, and righteousness.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <Card className="card-sacred mb-12">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-8">
              <Heart className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold text-primary">Our Values</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-devanagari text-primary mb-3">सत्य</div>
                <h3 className="font-semibold text-lg mb-2">Truth (Satya)</h3>
                <p className="text-muted-foreground text-sm">
                  Commitment to authentic and verified spiritual content
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-devanagari text-primary mb-3">धर्म</div>
                <h3 className="font-semibold text-lg mb-2">Righteousness (Dharma)</h3>
                <p className="text-muted-foreground text-sm">
                  Upholding moral and ethical principles in all our endeavors
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-devanagari text-primary mb-3">सेवा</div>
                <h3 className="font-semibold text-lg mb-2">Service (Seva)</h3>
                <p className="text-muted-foreground text-sm">
                  Selfless service to the spiritual community worldwide
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-devanagari text-primary mb-3">ज्ञान</div>
                <h3 className="font-semibold text-lg mb-2">Knowledge (Gyan)</h3>
                <p className="text-muted-foreground text-sm">
                  Promoting learning and wisdom through accessible resources
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What We Offer */}
        <Card className="card-divine mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-primary text-center mb-8">
              What We Offer
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">📚 Sacred Texts</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Complete collection of Vedas, Upanishads, and Puranas</li>
                  <li>• Bhagavad Gita with multiple commentaries</li>
                  <li>• Ramayana and Mahabharata in various languages</li>
                  <li>• Dharma Shastras and philosophical texts</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">🕉️ Spiritual Practices</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Divine mantras with meanings and audio</li>
                  <li>• Naam Jap counter with target setting</li>
                  <li>• Meditation and prayer guides</li>
                  <li>• Festival calendars and celebrations</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">🛍️ Sacred Store</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Authentic spiritual books and texts</li>
                  <li>• Pooja kits and ritual essentials</li>
                  <li>• QR-based digital darshan cards</li>
                  <li>• Traditional accessories and items</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">🌐 Free Access</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 100% free access to all digital content</li>
                  <li>• No registration required for reading</li>
                  <li>• Available in 8+ Indian languages</li>
                  <li>• Mobile-friendly responsive design</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="card-sacred">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-primary text-center mb-8">
              Get in Touch
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <Mail className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold text-lg">Email Us</h3>
                <p className="text-muted-foreground">
                  contact@sanatanigyan.org
                </p>
              </div>
              
              <div className="space-y-3">
                <Phone className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold text-lg">Call Us</h3>
                <p className="text-muted-foreground">
                  +91 98765 43210
                </p>
              </div>
              
              <div className="space-y-3">
                <MapPin className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold text-lg">Visit Us</h3>
                <p className="text-muted-foreground">
                  Vedic Knowledge Center<br />
                  New Delhi, India
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8 pt-8 border-t">
              <p className="text-muted-foreground italic text-lg">
                "Knowledge is the most sacred gift we can share with humanity."
              </p>
              <p className="text-primary font-devanagari text-xl mt-2">
                ॐ शान्ति शान्ति शान्तिः
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}