// Constitutional Nexus - Data Utilities

import { Article, Part, Category, SearchIndex, ConstitutionData } from '@/types';

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export class DataService {
  private static cache: Map<string, any> = new Map();

  static async fetchJSON<T>(path: string): Promise<T> {
    const fullPath = `${BASE_PATH}${path}`;
    if (this.cache.has(fullPath)) {
      return this.cache.get(fullPath);
    }

    const response = await fetch(fullPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${fullPath}`);
    }
    
    const data = await response.json();
    this.cache.set(fullPath, data);
    return data;
  }

  static async getArticles(): Promise<Article[]> {
    return this.fetchJSON<Article[]>('/data/articles.json');
  }

  static async getParts(): Promise<Part[]> {
    return this.fetchJSON<Part[]>('/data/parts.json');
  }

  static async getCategories(): Promise<Category[]> {
    return this.fetchJSON<Category[]>('/data/categories.json');
  }

  static async getSearchIndex(): Promise<SearchIndex> {
    return this.fetchJSON<SearchIndex>('/data/search_index.json');
  }

  static async getCompleteData(): Promise<ConstitutionData> {
    return this.fetchJSON<ConstitutionData>('/data/constitution_complete.json');
  }

  static clearCache() {
    this.cache.clear();
  }
}

export class SearchService {
  private searchIndex: SearchIndex | null = null;
  private articles: Article[] = [];

  async initialize() {
    this.searchIndex = await DataService.getSearchIndex();
    this.articles = await DataService.getArticles();
  }

  setArticles(articles: Article[]) {
    this.articles = articles;
  }

  search(query: string, filters?: {
    category?: string;
    part?: string;
    status?: 'active' | 'omitted';
  }): Article[] {
    if (!query && !filters) return this.articles;

    let results = [...this.articles];

    // Apply filters first
    if (filters?.category) {
      results = results.filter(a => a.categories.includes(filters.category!));
    }

    if (filters?.part) {
      results = results.filter(a => a.part_number === filters.part);
    }

    if (filters?.status) {
      results = results.filter(a => a.status === filters.status);
    }

    // Apply text search
    if (query) {
      const queryLower = query.toLowerCase();
      const tokens = queryLower.split(/\s+/).filter(t => t.length > 2);

      results = results.filter(article => {
        const searchText = `${article.article_number} ${article.provision} ${article.part_title}`.toLowerCase();
        return tokens.some(token => searchText.includes(token));
      });
    }

    return results;
  }

  getArticleById(id: string): Article | undefined {
    return this.articles.find(a => a.id === id);
  }

  getArticleByNumber(number: string): Article | undefined {
    return this.articles.find(a => a.article_number === number);
  }

  getSimilarArticles(article: Article, limit: number = 5): Article[] {
    return this.articles
      .filter(a => 
        a.id !== article.id && 
        (a.part_number === article.part_number || 
         a.categories.some(c => article.categories.includes(c)))
      )
      .slice(0, limit);
  }
}

export const formatArticleNumber = (num: string): string => {
  return `Article ${num}`;
};

export const getStatusColor = (status: string): string => {
  return status === 'active' ? 'text-green-600' : 'text-gray-500';
};

export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Fundamental Rights': 'bg-blue-100 text-blue-800',
    'Directive Principles': 'bg-purple-100 text-purple-800',
    'Union Powers': 'bg-indigo-100 text-indigo-800',
    'State Powers': 'bg-pink-100 text-pink-800',
    'Judiciary': 'bg-amber-100 text-amber-800',
    'Elections': 'bg-green-100 text-green-800',
    'Emergency': 'bg-red-100 text-red-800',
    'Citizenship': 'bg-cyan-100 text-cyan-800',
  };

  return colors[category] || 'bg-gray-100 text-gray-800';
};
