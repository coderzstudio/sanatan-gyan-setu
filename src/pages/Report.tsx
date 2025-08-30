import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { breadcrumbStructuredData } from "@/utils/seoData";

const issueTypes = [
  { value: "copyright", label: "Copyright Infringement" },
  { value: "bug", label: "Website Bug" },
  { value: "content", label: "Content Issue" },
  { value: "feature", label: "Feature Request" },
  { value: "general", label: "General Query" },
  { value: "other", label: "Other" },
];

export default function Report() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue_type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const breadcrumbData = breadcrumbStructuredData([
    { name: "Home", url: "https://sanatanigyan.netlify.app/" },
    { name: "Report Issue", url: "https://sanatanigyan.netlify.app/report" }
  ]);

  // ... keep existing code (handleInputChange, handleSubmit functions)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.issue_type || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("reports")
        .insert([formData]);

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast({
        title: "Report Submitted",
        description: "Thank you for your feedback. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        issue_type: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title="Report Submitted Successfully | Sanatani Gyan"
          description="Thank you for your feedback. Your report has been submitted and our team will review it within 24-48 hours."
          url="https://sanatanigyan.netlify.app/report"
          noindex={true}
        />
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="card-sacred text-center">
              <CardContent className="p-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-primary mb-4">
                  Thank You!
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Your report has been submitted successfully. Our team will review 
                  your feedback and get back to you within 24-48 hours.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="btn-divine"
                >
                  Submit Another Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Report an Issue - Bug Reports & Feedback | Sanatani Gyan"
        description="Report bugs, copyright issues, content problems or share feedback to help us improve Sanatani Gyan. We respond to all reports within 24-48 hours."
        keywords="report bug, website feedback, copyright issue, content problem, technical support, user feedback, issue reporting"
        url="https://sanatanigyan.netlify.app/report"
        structuredData={breadcrumbData}
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Report an Issue
            </h1>
            <p className="text-lg text-muted-foreground">
              Help us improve by reporting bugs, copyright issues, or sharing feedback. 
              We value your input and respond to all reports.
            </p>
          </div>

          {/* Form */}
          <Card className="card-divine">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <AlertCircle className="mr-3 h-6 w-6" />
                Submit Your Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-base font-semibold">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-base font-semibold">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {/* Issue Type */}
                <div>
                  <Label className="text-base font-semibold">
                    Issue Type *
                  </Label>
                  <Select
                    value={formData.issue_type}
                    onValueChange={(value) => handleInputChange("issue_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-base font-semibold">
                    Detailed Message *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please provide detailed information about your issue or feedback..."
                    rows={6}
                    required
                  />
                </div>

                {/* Guidelines */}
                <div className="bg-gradient-divine rounded-lg p-4">
                  <h3 className="font-semibold text-primary mb-2">Reporting Guidelines:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Be specific and provide as much detail as possible</li>
                    <li>• For copyright issues, include the content URL and ownership details</li>
                    <li>• For bugs, describe the steps to reproduce the issue</li>
                    <li>• Include browser information for technical issues</li>
                    <li>• We respond to all reports within 24-48 hours</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-divine w-full text-lg py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              For urgent matters, you can also email us directly at{" "}
              <a href="mailto:urgent@sanatanigyan.org" className="text-primary hover:underline">
                urgent@sanatanigyan.org
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}