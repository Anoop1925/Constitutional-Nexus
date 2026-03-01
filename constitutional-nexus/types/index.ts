// Constitutional Nexus - Type Definitions

export interface Article {
  id: string;
  article_number: string;
  article_text: string;
  provision: string;
  part_number: string;
  part_title: string;
  part_full: string;
  chapter: string | null;
  status: 'active' | 'omitted';
  categories: string[];
  keywords: string[];
  provision_length: number;
}

export interface Part {
  id: string;
  number: string;
  title: string;
  full_title: string;
  article_count: number;
}

export interface Category {
  name: string;
  count: number;
  articles: {
    article_id: string;
    article_number: string;
    provision: string;
  }[];
}

export interface Relationship {
  source: string;
  target: string;
  source_article: string;
  target_article: string;
  type: 'references' | 'same_part';
}

export interface SearchIndex {
  token_map: { [key: string]: ArticleSnippet[] };
  article_tokens: { [key: string]: string[] };
  fuzzy_index: { [key: string]: string[] };
  category_index: { [key: string]: ArticleSnippet[] };
  part_index: { [key: string]: ArticleSnippet[] };
  article_number_index: { [key: string]: string };
  quick_filters: { [key: string]: QuickFilter };
  life_situations: LifeSituation[];
  metadata: SearchMetadata;
}

export interface ArticleSnippet {
  id: string;
  article_number: string;
  provision_snippet: string;
  chapter?: string;
}

export interface QuickFilter {
  name: string;
  description: string;
  category: string;
}

export interface LifeSituation {
  id: string;
  title: string;
  description: string;
  articles: string[];
  categories: string[];
  keywords: string[];
}

export interface SearchMetadata {
  total_articles: number;
  total_tokens: number;
  total_categories: number;
  total_parts: number;
  index_version: string;
  generated_at: string;
  most_common_tokens: {
    token: string;
    article_count: number;
  }[];
}

export interface ConstitutionData {
  metadata: {
    total_parts: number;
    total_articles: number;
    total_categories: number;
    total_relationships: number;
    generated_at: string;
  };
  parts: Part[];
  articles: Article[];
  categories: Category[];
  relationships: Relationship[];
}
