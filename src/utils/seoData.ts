export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Sanatani Gyan",
  "alternateName": "Hindu Spiritual Wisdom Platform",
  "url": "https://sanatanigyan.netlify.app",
  "description": "Comprehensive digital repository of Hindu scriptures, mantras, and spiritual wisdom accessible to seekers worldwide.",
  "inLanguage": ["en", "hi", "gu", "bn", "ta", "te", "kn", "ml"],
  "author": {
    "@type": "Organization",
    "name": "Sanatani Gyan",
    "url": "https://sanatanigyan.netlify.app",
    "email": "sanatanigyann@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    }
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://sanatanigyan.netlify.app/books?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sanatani Gyan",
  "url": "https://sanatanigyan.netlify.app",
  "logo": "https://sanatanigyan.netlify.app/logo-512.png",
  "description": "Digital platform for authentic Hindu scriptures, mantras, and spiritual knowledge",
  "email": "sanatanigyann@gmail.com",
  "telephone": "+91-98765-43210",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Surat",
    "addressRegion": "Gujarat",
    "addressCountry": "IN"
  },
  "foundingDate": "2024",
  "knowsAbout": [
    "Hindu Scriptures",
    "Vedic Literature", 
    "Sanskrit Mantras",
    "Spiritual Wisdom",
    "Religious Texts",
    "Meditation",
    "Hindu Philosophy"
  ],
  "sameAs": [
    "https://sanatanigyan.netlify.app"
  ]
};

export const createBookStructuredData = (book: any) => ({
  "@context": "https://schema.org",
  "@type": "Book",
  "name": book.title,
  "description": book.description || `Sacred Hindu scripture: ${book.title}`,
  "author": book.author || "Ancient Sages",
  "publisher": "Sanatani Gyan",
  "inLanguage": book.language,
  "genre": "Religious Text",
  "bookFormat": "EBook",
  "isAccessibleForFree": true,
  "url": `https://sanatanigyan.netlify.app/book/${book.id}`,
  "image": book.image_url || "https://sanatanigyan.netlify.app/default-book.jpg",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "bestRating": "5",
    "ratingCount": "1000"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  }
});

export const createMantraStructuredData = (mantra: any) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": mantra.title,
  "description": `Sacred mantra dedicated to ${mantra.deity}: ${mantra.title}`,
  "author": "Ancient Sages",
  "publisher": "Sanatani Gyan",
  "inLanguage": "Sanskrit",
  "genre": "Religious Chant",
  "keywords": `${mantra.deity}, mantra, Sanskrit, Hindu prayer, spiritual chant`,
  "url": `https://sanatanigyan.netlify.app/mantra/${mantra.id}`,
  "isAccessibleForFree": true,
  "about": {
    "@type": "Thing",
    "name": mantra.deity,
    "description": `Hindu deity ${mantra.deity}`
  }
});

export const breadcrumbStructuredData = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Sanatani Gyan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sanatani Gyan is a comprehensive digital platform providing free access to authentic Hindu scriptures, mantras, and spiritual wisdom in multiple Indian languages."
      }
    },
    {
      "@type": "Question", 
      "name": "Is all content on Sanatani Gyan free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all digital content including books, mantras, and spiritual texts on Sanatani Gyan is completely free to access without any registration required."
      }
    },
    {
      "@type": "Question",
      "name": "What languages are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sanatani Gyan supports 8+ Indian languages including Hindi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, and Sanskrit."
      }
    },
    {
      "@type": "Question",
      "name": "What types of scriptures are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our collection includes Vedas, Upanishads, Puranas, Bhagavad Gita, Ramayana, Mahabharata, Dharma Shastras, and various philosophical texts with authentic translations."
      }
    }
  ]
};