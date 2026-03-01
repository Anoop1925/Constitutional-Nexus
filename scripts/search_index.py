"""
Constitutional Nexus - Search Index Builder
===========================================
Creates lightweight search indexes for fast client-side searching.
"""

import json
import re
from collections import defaultdict
import os

class SearchIndexBuilder:
    def __init__(self, data_dir='data'):
        self.data_dir = data_dir
        self.articles = []
        self.search_index = {
            'token_map': {},      # token -> article IDs
            'article_tokens': {}, # article ID -> tokens
            'fuzzy_index': {},    # 3-char prefixes -> tokens
            'category_index': {}, # category -> article IDs
            'part_index': {}      # part -> article IDs
        }
    
    def load_articles(self):
        """Load normalized articles"""
        try:
            filepath = os.path.join(self.data_dir, 'articles.json')
            with open(filepath, 'r', encoding='utf-8') as f:
                self.articles = json.load(f)
            
            print(f"✅ Loaded {len(self.articles)} articles")
            return True
        except Exception as e:
            print(f"❌ Error loading articles: {e}")
            return False
    
    def tokenize(self, text):
        """Tokenize text into searchable tokens"""
        if not text:
            return []
        
        # Convert to lowercase
        text = str(text).lower()
        
        # Remove special characters but keep spaces
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # Split into words
        words = text.split()
        
        # Filter out very short words and numbers
        tokens = [w for w in words if len(w) > 2]
        
        return list(set(tokens))  # Remove duplicates
    
    def create_ngrams(self, text, n=3):
        """Create n-grams for fuzzy matching"""
        text = str(text).lower()
        text = re.sub(r'[^\w]', '', text)
        
        if len(text) < n:
            return [text]
        
        ngrams = []
        for i in range(len(text) - n + 1):
            ngrams.append(text[i:i+n])
        
        return ngrams
    
    def build_token_index(self):
        """Build token-to-article mapping"""
        print("\n🔍 Building token index...")
        
        token_map = defaultdict(list)
        article_tokens = {}
        
        for article in self.articles:
            article_id = article['id']
            
            # Tokenize different fields
            tokens = set()
            tokens.update(self.tokenize(article['article_number']))
            tokens.update(self.tokenize(article['provision']))
            tokens.update(self.tokenize(article['part_title']))
            
            # Add keywords
            if article.get('keywords'):
                tokens.update(article['keywords'])
            
            # Store tokens for this article
            article_tokens[article_id] = list(tokens)
            
            # Map tokens to article
            for token in tokens:
                token_map[token].append({
                    'id': article_id,
                    'article_number': article['article_number'],
                    'provision_snippet': article['provision'][:100]
                })
        
        self.search_index['token_map'] = dict(token_map)
        self.search_index['article_tokens'] = article_tokens
        
        print(f"   ✅ Indexed {len(token_map)} unique tokens")
        print(f"   ✅ Mapped {len(article_tokens)} articles")
    
    def build_fuzzy_index(self):
        """Build fuzzy search index using n-grams"""
        print("\n🔍 Building fuzzy index...")
        
        fuzzy_map = defaultdict(set)
        
        # Index all tokens with their n-grams
        for token in self.search_index['token_map'].keys():
            ngrams = self.create_ngrams(token, n=3)
            for ngram in ngrams:
                fuzzy_map[ngram].add(token)
        
        # Convert sets to lists for JSON
        self.search_index['fuzzy_index'] = {k: list(v) for k, v in fuzzy_map.items()}
        
        print(f"   ✅ Created {len(fuzzy_map)} fuzzy patterns")
    
    def build_category_index(self):
        """Build category-based index"""
        print("\n🏷️  Building category index...")
        
        category_map = defaultdict(list)
        
        for article in self.articles:
            article_id = article['id']
            categories = article.get('categories', [])
            
            for category in categories:
                category_map[category].append({
                    'id': article_id,
                    'article_number': article['article_number'],
                    'provision_snippet': article['provision'][:100]
                })
        
        self.search_index['category_index'] = dict(category_map)
        
        print(f"   ✅ Indexed {len(category_map)} categories")
    
    def build_part_index(self):
        """Build part-based index"""
        print("\n📚 Building part index...")
        
        part_map = defaultdict(list)
        
        for article in self.articles:
            article_id = article['id']
            part_num = article.get('part_number')
            
            if part_num:
                part_map[part_num].append({
                    'id': article_id,
                    'article_number': article['article_number'],
                    'provision_snippet': article['provision'][:100],
                    'chapter': article.get('chapter')
                })
        
        self.search_index['part_index'] = dict(part_map)
        
        print(f"   ✅ Indexed {len(part_map)} parts")
    
    def build_article_number_index(self):
        """Build direct article number lookup"""
        print("\n📜 Building article number index...")
        
        article_number_map = {}
        
        for article in self.articles:
            article_num = article.get('article_number')
            if article_num:
                article_number_map[article_num] = article['id']
        
        self.search_index['article_number_index'] = article_number_map
        
        print(f"   ✅ Indexed {len(article_number_map)} article numbers")
    
    def create_search_metadata(self):
        """Create metadata for search system"""
        print("\n📊 Creating search metadata...")
        
        metadata = {
            'total_articles': len(self.articles),
            'total_tokens': len(self.search_index['token_map']),
            'total_categories': len(self.search_index['category_index']),
            'total_parts': len(self.search_index['part_index']),
            'index_version': '1.0',
            'generated_at': None  # Will be set during export
        }
        
        # Get top tokens
        token_counts = {token: len(articles) for token, articles in self.search_index['token_map'].items()}
        top_tokens = sorted(token_counts.items(), key=lambda x: x[1], reverse=True)[:20]
        
        metadata['most_common_tokens'] = [
            {'token': token, 'article_count': count} 
            for token, count in top_tokens
        ]
        
        self.search_index['metadata'] = metadata
        
        print(f"   ✅ Created search metadata")
    
    def create_quick_filters(self):
        """Create predefined quick filter queries"""
        print("\n⚡ Creating quick filters...")
        
        quick_filters = {
            'fundamental_rights': {
                'name': 'Fundamental Rights',
                'description': 'Articles related to fundamental rights',
                'category': 'Fundamental Rights'
            },
            'citizenship': {
                'name': 'Citizenship',
                'description': 'Articles about citizenship',
                'category': 'Citizenship'
            },
            'emergency': {
                'name': 'Emergency Provisions',
                'description': 'Articles related to emergency powers',
                'category': 'Emergency'
            },
            'judiciary': {
                'name': 'Judiciary',
                'description': 'Articles about courts and justice',
                'category': 'Judiciary'
            },
            'elections': {
                'name': 'Elections',
                'description': 'Articles about electoral processes',
                'category': 'Elections'
            },
            'union_powers': {
                'name': 'Union Powers',
                'description': 'Articles about central government powers',
                'category': 'Union Powers'
            },
            'state_powers': {
                'name': 'State Powers',
                'description': 'Articles about state government powers',
                'category': 'State Powers'
            }
        }
        
        self.search_index['quick_filters'] = quick_filters
        
        print(f"   ✅ Created {len(quick_filters)} quick filters")
    
    def create_life_situations(self):
        """Create life situation mappings"""
        print("\n🏠 Creating life situation mappings...")
        
        situations = [
            {
                'id': 'voting',
                'title': 'I want to vote',
                'description': 'Rights and provisions related to voting',
                'articles': ['324', '325', '326'],
                'categories': ['Elections'],
                'keywords': ['election', 'vote', 'suffrage']
            },
            {
                'id': 'discrimination',
                'title': 'I faced discrimination',
                'description': 'Protection against discrimination',
                'articles': ['14', '15', '16'],
                'categories': ['Fundamental Rights'],
                'keywords': ['equality', 'discrimination', 'protection']
            },
            {
                'id': 'speech',
                'title': 'Freedom of speech issue',
                'description': 'Rights related to freedom of speech',
                'articles': ['19'],
                'categories': ['Fundamental Rights'],
                'keywords': ['freedom', 'speech', 'expression']
            },
            {
                'id': 'arrest',
                'title': 'Arrested or detained',
                'description': 'Rights during arrest and detention',
                'articles': ['20', '21', '22'],
                'categories': ['Fundamental Rights'],
                'keywords': ['arrest', 'detention', 'protection', 'liberty']
            },
            {
                'id': 'property',
                'title': 'Property rights',
                'description': 'Articles about property acquisition',
                'articles': ['300A', '31A'],
                'categories': ['Property'],
                'keywords': ['property', 'acquisition', 'compensation']
            },
            {
                'id': 'education',
                'title': 'Right to education',
                'description': 'Education-related rights',
                'articles': ['21A', '29', '30'],
                'categories': ['Education', 'Fundamental Rights'],
                'keywords': ['education', 'school', 'learning']
            },
            {
                'id': 'employment',
                'title': 'Government job discrimination',
                'description': 'Equal opportunity in public employment',
                'articles': ['16', '335'],
                'categories': ['Fundamental Rights', 'Services'],
                'keywords': ['employment', 'service', 'opportunity']
            },
            {
                'id': 'religion',
                'title': 'Religious freedom',
                'description': 'Freedom of religion and worship',
                'articles': ['25', '26', '27', '28'],
                'categories': ['Fundamental Rights'],
                'keywords': ['religion', 'worship', 'freedom']
            }
        ]
        
        self.search_index['life_situations'] = situations
        
        print(f"   ✅ Created {len(situations)} life situation mappings")
    
    def save_index(self, filename='search_index.json'):
        """Save search index to file"""
        import datetime
        
        # Update metadata timestamp
        self.search_index['metadata']['generated_at'] = datetime.datetime.now().isoformat()
        
        os.makedirs(self.data_dir, exist_ok=True)
        filepath = os.path.join(self.data_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.search_index, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Search index saved to: {filepath}")
        
        # Calculate and display size
        size = os.path.getsize(filepath)
        size_mb = size / (1024 * 1024)
        print(f"   Size: {size_mb:.2f} MB")
    
    def run_indexing(self):
        """Run complete indexing pipeline"""
        print("\n" + "="*60)
        print("🚀 SEARCH INDEX BUILDER")
        print("="*60)
        
        if not self.load_articles():
            return False
        
        self.build_token_index()
        self.build_fuzzy_index()
        self.build_category_index()
        self.build_part_index()
        self.build_article_number_index()
        self.create_search_metadata()
        self.create_quick_filters()
        self.create_life_situations()
        self.save_index()
        
        print("\n" + "="*60)
        print("✅ SEARCH INDEX COMPLETE")
        print("="*60)
        
        return True


if __name__ == "__main__":
    builder = SearchIndexBuilder()
    
    if builder.run_indexing():
        print("\n🎯 Data Engineering Complete!")
        print("\nGenerated Files:")
        print("   📂 data/articles.json")
        print("   📂 data/parts.json")
        print("   📂 data/categories.json")
        print("   📂 data/relationships.json")
        print("   📂 data/search_index.json")
        print("   📂 data/constitution_complete.json")
        print("\n🚀 Ready for Frontend Development!")
        print("   Next: Initialize Next.js project")
