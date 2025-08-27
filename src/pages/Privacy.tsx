import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="card-divine">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, such as when you:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Contact us through our contact form</li>
                  <li>Report issues or provide feedback</li>
                  <li>Browse our books, mantras, and other content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Respond to your questions and comments</li>
                  <li>Improve our website and services</li>
                  <li>Send you updates about new content (with your consent)</li>
                  <li>Ensure the security of our website</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">Information Sharing</h2>
                <p className="text-muted-foreground">
                  We do not sell, trade, or share your personal information with third parties 
                  except as described in this privacy policy or with your consent. We may share 
                  information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who help us operate our website</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">Data Security</h2>
                <p className="text-muted-foreground">
                  We take reasonable measures to protect your personal information from loss, 
                  theft, misuse, unauthorized access, disclosure, alteration, and destruction. 
                  However, no internet transmission is completely secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">Cookies and Tracking</h2>
                <p className="text-muted-foreground">
                  We use local storage to remember your preferences and recently viewed content 
                  to improve your browsing experience. This information is stored locally on 
                  your device and is not transmitted to our servers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Withdraw consent for communications</li>
                  <li>File a complaint with relevant authorities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy or our practices, 
                  please contact us at:
                </p>
                <p className="text-primary font-medium mt-2">
                  sanatanigyann@gmail.com
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you 
                  of any changes by posting the new Privacy Policy on this page and updating 
                  the "Last updated" date.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}