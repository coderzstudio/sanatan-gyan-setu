import { Link } from "react-router-dom";
import { Instagram, Youtube, Send, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gradient-divine border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl font-devanagari text-primary">ॐ</div>
              <span className="text-xl font-semibold">
                Sanatani Gyan Library
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your gateway to ancient wisdom and spiritual knowledge. 
              Discover, learn, and grow with our collection of 
              texts, mantras, and spiritual guidance.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Send className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/books" className="block text-muted-foreground hover:text-primary transition-colors">
                Books
              </Link>
              <Link to="/mantras" className="block text-muted-foreground hover:text-primary transition-colors">
                Mantras
              </Link>
              <Link to="/naam-jap" className="block text-muted-foreground hover:text-primary transition-colors">
                Naam Jap
              </Link>
              <Link to="/store" className="block text-muted-foreground hover:text-primary transition-colors">
                Store
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/report" className="block text-muted-foreground hover:text-primary transition-colors">
                Report Issue
              </Link>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 Sanatani Gyan Library. All rights reserved. | 
            <span className="font-devanagari text-primary ml-2">सत्यमेव जयते</span>
          </p>
        </div>
      </div>
    </footer>
  );
}