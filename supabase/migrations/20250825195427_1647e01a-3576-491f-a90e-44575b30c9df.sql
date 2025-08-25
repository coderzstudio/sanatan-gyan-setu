-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create books table
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  pdf_link TEXT,
  author TEXT,
  language TEXT DEFAULT 'Hindi',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create mantras table
CREATE TABLE public.mantras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  deity TEXT NOT NULL,
  mantra_text TEXT NOT NULL,
  meaning TEXT,
  audio_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  category TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mantras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read access for books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Public read access for mantras" ON public.mantras FOR SELECT USING (true);
CREATE POLICY "Public read access for products" ON public.products FOR SELECT USING (true);

-- Create policy for reports (insert only)
CREATE POLICY "Anyone can submit reports" ON public.reports FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_books_category_id ON public.books(category_id);
CREATE INDEX idx_books_created_at ON public.books(created_at DESC);
CREATE INDEX idx_mantras_deity ON public.mantras(deity);
CREATE INDEX idx_mantras_category ON public.mantras(category);

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
('Gita', 'Bhagavad Gita and related texts'),
('Ramayan', 'Ramayana and related scriptures'),
('Mahabharat', 'Mahabharata and related texts'),
('Vedas', 'Vedic literature and hymns'),
('Upanishads', 'Philosophical texts of Hinduism'),
('Puranas', 'Ancient stories and legends'),
('Dharma Shastras', 'Texts on righteous living'),
('Devotional', 'Bhakti and devotional literature');

-- Insert sample books
INSERT INTO public.books (title, description, category_id, language, image_url, pdf_link) VALUES
('Shrimad Bhagavad Gita', 'The divine song of Lord Krishna', (SELECT id FROM public.categories WHERE name = 'Gita'), 'Hindi', '/placeholder-book.jpg', 'https://drive.google.com/file/d/sample1'),
('Valmiki Ramayan', 'The original epic by Sage Valmiki', (SELECT id FROM public.categories WHERE name = 'Ramayan'), 'Sanskrit', '/placeholder-book.jpg', 'https://drive.google.com/file/d/sample2'),
('Rig Veda', 'The oldest of the four Vedas', (SELECT id FROM public.categories WHERE name = 'Vedas'), 'Sanskrit', '/placeholder-book.jpg', 'https://drive.google.com/file/d/sample3');

-- Insert sample mantras
INSERT INTO public.mantras (title, deity, mantra_text, meaning, category) VALUES
('Maha Mantra', 'Krishna', 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे, हरे राम हरे राम राम राम हरे हरे', 'The great mantra for liberation', 'Krishna'),
('Om Namah Shivaya', 'Shiva', 'ॐ नमः शिवाय', 'I bow to Lord Shiva', 'Shiva'),
('Om Gam Ganapataye Namaha', 'Ganesh', 'ॐ गं गणपतये नमः', 'Salutations to Lord Ganesha', 'Ganesh');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for books updated_at
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();