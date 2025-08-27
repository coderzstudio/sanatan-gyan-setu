import { supabase } from "@/integrations/supabase/client";
import { cache } from "./cache";

interface PaginationOptions {
  limit?: number;
  offset?: number;
}

interface Book {
  id: string;
  title: string;
  description?: string;
  language: string;
  image_url?: string;
  category: {
    name: string;
  };
}

interface BookDetail extends Book {
  author?: string;
  pdf_link?: string;
  category: {
    name: string;
    description: string;
  };
}

interface Mantra {
  id: string;
  title: string;
  deity: string;
  category: string;
}

interface MantraDetail extends Mantra {
  mantra_text: string;
  meaning?: string;
  audio_url?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
  in_stock?: boolean;
}

class DataService {
  // Books
  async fetchBooks(options: PaginationOptions = {}): Promise<Book[]> {
    const { limit = 12, offset = 0 } = options;
    const cacheKey = `books_${limit}_${offset}`;
    
    const cached = cache.get<Book[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from("books")
      .select(`
        id,
        title,
        description,
        language,
        image_url,
        category:categories(name)
      `)
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    cache.set(cacheKey, data || []);
    return data || [];
  }

  async fetchBookDetail(id: string): Promise<BookDetail | null> {
    const cacheKey = `book_detail_${id}`;
    
    const cached = cache.get<BookDetail>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from("books")
      .select(`
        id,
        title,
        description,
        author,
        language,
        image_url,
        pdf_link,
        category:categories(name, description)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    
    cache.set(cacheKey, data);
    return data;
  }

  async fetchRecentBooks(limit: number = 10): Promise<Book[]> {
    const cacheKey = `recent_books_${limit}`;
    
    const cached = cache.get<Book[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from("books")
      .select(`
        id,
        title,
        language,
        image_url,
        category:categories(name)
      `)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    cache.set(cacheKey, data || []);
    return data || [];
  }

  async fetchBooksByCategory(categoryId: string, limit: number = 4): Promise<Book[]> {
    const cacheKey = `books_category_${categoryId}_${limit}`;
    
    const cached = cache.get<Book[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from("books")
      .select(`
        id,
        title,
        description,
        language,
        image_url,
        category:categories(name)
      `)
      .eq("category_id", categoryId)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    cache.set(cacheKey, data || []);
    return data || [];
  }

  // Mantras
  async fetchMantras(options: PaginationOptions = {}): Promise<Mantra[]> {
    const { limit = 12, offset = 0 } = options;
    const cacheKey = `mantras_${limit}_${offset}`;
    
    const cached = cache.get<Mantra[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from("mantras")
      .select("id, title, deity, category")
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    cache.set(cacheKey, data || []);
    return data || [];
  }

  async fetchMantraDetail(id: string): Promise<MantraDetail | null> {
    const cacheKey = `mantra_detail_${id}`;
    
    const cached = cache.get<MantraDetail>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from("mantras")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    
    cache.set(cacheKey, data);
    return data;
  }

  async fetchRecentMantras(limit: number = 8): Promise<Mantra[]> {
    const cacheKey = `recent_mantras_${limit}`;
    
    const cached = cache.get<Mantra[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from("mantras")
      .select("id, title, deity, category")
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    cache.set(cacheKey, data || []);
    return data || [];
  }

  // Products
  async fetchProducts(options: PaginationOptions = {}): Promise<Product[]> {
    const { limit = 12, offset = 0 } = options;
    const cacheKey = `products_${limit}_${offset}`;
    
    const cached = cache.get<Product[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, image_url, category, in_stock")
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    cache.set(cacheKey, data || []);
    return data || [];
  }

  // Categories
  async fetchCategories() {
    const cacheKey = "categories";
    
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) throw error;
    
    cache.set(cacheKey, data || []);
    return data || [];
  }
}

export const dataService = new DataService();