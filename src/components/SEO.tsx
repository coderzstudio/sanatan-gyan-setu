import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
  canonical?: string;
  noindex?: boolean;
}

const defaultSEO = {
  title: "Sanatani Gyan - Sacred Hindu Scriptures, Mantras & Spiritual Wisdom",
  description: "Discover authentic Hindu scriptures, divine mantras, Vedic texts, and spiritual wisdom. Free access to Bhagavad Gita, Vedas, Upanishads, and sacred knowledge in 8+ languages.",
  keywords: "Hindu scriptures, Vedic texts, mantras, Bhagavad Gita, Vedas, Upanishads, spiritual wisdom, Sanskrit, Hindu philosophy, dharma, meditation, prayer, sacred texts, religious books",
  image: "https://sanatanigyan.netlify.app/og-image.jpg",
  url: "https://sanatanigyan.netlify.app"
};

export default function SEO({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url = defaultSEO.url,
  type = "website",
  structuredData,
  canonical,
  noindex = false
}: SEOProps) {
  const fullTitle = title === defaultSEO.title ? title : `${title} | Sanatani Gyan`;
  const canonicalUrl = canonical || url;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Sanatani Gyan" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ff6b35" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Sanatani Gyan" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@sanatanigyan" />
      
      {/* Additional SEO Tags */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.country" content="India" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}