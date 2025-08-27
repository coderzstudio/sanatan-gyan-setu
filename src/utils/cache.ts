// Cache utility for storing and retrieving data
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry?: number;
}

class Cache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultExpiry = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, expiry?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: expiry || this.defaultExpiry
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.expiry!) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  // Local storage methods for persistent cache
  setLocal<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  getLocal<T>(key: string, maxAge: number = this.defaultExpiry): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const { data, timestamp } = JSON.parse(item);
      if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  removeLocal(key: string): void {
    localStorage.removeItem(key);
  }
}

export const cache = new Cache();