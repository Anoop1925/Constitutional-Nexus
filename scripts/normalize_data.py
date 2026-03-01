"""
Constitutional Nexus - Data Normalization Module
================================================
Cleans, normalizes, and structures constitutional data into JSON datasets.
"""

import pandas as pd
import numpy as np
import json
import re
from collections import defaultdict
import os

class DataNormalizer:
    def __init__(self, csv_path):
        self.csv_path = csv_path
        self.df = None
        self.normalized_data = {}
        
    def load_data(self):
        """Load CSV data"""
        encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252', 'utf-8-sig']
        
        for encoding in encodings:
            try:
                self.df = pd.read_csv(self.csv_path, encoding=encoding)
                print(f"✅ Loaded {len(self.df)} records with {encoding} encoding")
                return True
            except Exception as e:
                continue
        
        print(f"❌ Error loading CSV with any encoding")
        return False
    
    def clean_data(self):
        """Clean and standardize data"""
        print("\n🧹 Cleaning data...")
        
        # Remove leading/trailing whitespace
        for col in self.df.columns:
            if self.df[col].dtype == 'object':
                self.df[col] = self.df[col].str.strip()
        
        # Fill empty chapters with empty string
        self.df['Chapter'] = self.df['Chapter'].fillna('')
        
        # Remove completely empty rows
        initial_count = len(self.df)
        self.df = self.df.dropna(subset=['Article', 'Provision'])
        removed = initial_count - len(self.df)
        
        print(f"   Removed {removed} empty rows")
        print(f"   Cleaned {len(self.df)} records")
        
        return True
    
    def extract_article_number(self, article_str):
        """Extract numeric article number"""
        match = re.search(r'Article\s+(\d+[A-Z]*)', str(article_str), re.IGNORECASE)
        if match:
            return match.group(1)
        return None
    
    def extract_part_number(self, part_str):
        """Extract part number from part string"""
        match = re.search(r'PART\s+(\d+[A-Z]*)', str(part_str), re.IGNORECASE)
        if match:
            return match.group(1)
        return None
    
    def extract_part_title(self, part_str):
        """Extract part title"""
        match = re.search(r'PART\s+\d+[A-Z]*:\s*(.+)', str(part_str), re.IGNORECASE)
        if match:
            return match.group(1).strip()
        return part_str
    
    def is_omitted(self, text):
        """Check if article is omitted"""
        return 'omitted' in str(text).lower()
    
    def normalize_parts(self):
        """Create normalized parts dataset"""
        print("\n📚 Normalizing Parts...")
        
        parts = []
        seen_parts = set()
        
        for _, row in self.df.iterrows():
            part_str = row['Part']
            if pd.isna(part_str) or part_str in seen_parts:
                continue
            
            part_num = self.extract_part_number(part_str)
            part_title = self.extract_part_title(part_str)
            
            # Count articles in this part
            article_count = len(self.df[self.df['Part'] == part_str])
            
            parts.append({
                'id': f'part-{part_num}' if part_num else f'part-{len(parts)}',
                'number': part_num,
                'title': part_title,
                'full_title': part_str,
                'article_count': article_count
            })
            
            seen_parts.add(part_str)
        
        self.normalized_data['parts'] = parts
        print(f"   Created {len(parts)} normalized parts")
        
        return parts
    
    def normalize_articles(self):
        """Create normalized articles dataset"""
        print("\n📜 Normalizing Articles...")
        
        articles = []
        article_id_counter = 1
        
        for idx, row in self.df.iterrows():
            article_str = row['Article']
            provision = row['Provision']
            part_str = row['Part']
            chapter_str = row['Chapter']
            
            article_num = self.extract_article_number(article_str)
            part_num = self.extract_part_number(part_str)
            part_title = self.extract_part_title(part_str)
            
            # Determine status
            is_omitted = self.is_omitted(provision) or self.is_omitted(article_str)
            status = 'omitted' if is_omitted else 'active'
            
            # Categorize article
            categories = self.categorize_article(provision, part_title)
            
            # Extract keywords
            keywords = self.extract_keywords(provision)
            
            article_obj = {
                'id': f'article-{article_id_counter}',
                'article_number': article_num,
                'article_text': article_str,
                'provision': provision,
                'part_number': part_num,
                'part_title': part_title,
                'part_full': part_str,
                'chapter': chapter_str if chapter_str else None,
                'status': status,
                'categories': categories,
                'keywords': keywords,
                'provision_length': len(str(provision))
            }
            
            articles.append(article_obj)
            article_id_counter += 1
        
        self.normalized_data['articles'] = articles
        print(f"   Created {len(articles)} normalized articles")
        print(f"   Active: {sum(1 for a in articles if a['status'] == 'active')}")
        print(f"   Omitted: {sum(1 for a in articles if a['status'] == 'omitted')}")
        
        return articles
    
    def categorize_article(self, provision, part_title):
        """Categorize article based on content"""
        categories = []
        provision_lower = str(provision).lower()
        part_lower = str(part_title).lower()
        
        # Category keywords
        category_map = {
            'Fundamental Rights': ['right', 'freedom', 'liberty'],
            'Citizenship': ['citizen', 'citizenship'],
            'Directive Principles': ['directive', 'policy', 'welfare'],
            'Union Powers': ['union', 'parliament', 'president'],
            'State Powers': ['state', 'governor', 'legislature'],
            'Judiciary': ['court', 'judge', 'justice', 'judicial'],
            'Elections': ['election', 'electoral', 'voter'],
            'Emergency': ['emergency', 'proclamation'],
            'Amendment': ['amendment', 'modify'],
            'Finance': ['finance', 'tax', 'revenue', 'budget'],
            'Services': ['service', 'commission', 'appointment'],
            'Property': ['property', 'acquisition', 'estate'],
            'Trade': ['trade', 'commerce', 'commercial'],
            'Education': ['education', 'educational', 'school'],
            'Language': ['language', 'hindi', 'official language']
        }
        
        # Check part-based categories
        if 'fundamental right' in part_lower:
            categories.append('Fundamental Rights')
        elif 'directive principle' in part_lower:
            categories.append('Directive Principles')
        elif 'union' in part_lower:
            categories.append('Union Powers')
        elif 'state' in part_lower and 'legislature' in part_lower:
            categories.append('State Powers')
        elif 'judiciary' in part_lower or 'court' in part_lower:
            categories.append('Judiciary')
        
        # Check provision-based categories
        for category, keywords in category_map.items():
            if any(keyword in provision_lower for keyword in keywords):
                if category not in categories:
                    categories.append(category)
        
        # Default category
        if not categories:
            categories.append('General')
        
        return categories
    
    def extract_keywords(self, provision):
        """Extract important keywords from provision"""
        # Common words to ignore
        stop_words = {'the', 'of', 'to', 'and', 'or', 'in', 'for', 'by', 'with', 'on', 'at', 'from', 'as', 'be', 'a', 'an'}
        
        # Extract words
        words = re.findall(r'\b[a-z]+\b', str(provision).lower())
        
        # Filter and count
        keywords = [w for w in words if w not in stop_words and len(w) > 3]
        
        # Get top keywords
        from collections import Counter
        keyword_counts = Counter(keywords)
        top_keywords = [k for k, _ in keyword_counts.most_common(5)]
        
        return top_keywords
    
    def build_relationships(self):
        """Build relationship graph between articles"""
        print("\n🔗 Building Relationships...")
        
        relationships = []
        articles = self.normalized_data['articles']
        
        for article in articles:
            provision = str(article['provision']).lower()
            source_id = article['id']
            
            # Find article references
            matches = re.findall(r'article[s]?\s+(\d+[A-Z]*)', provision, re.IGNORECASE)
            
            for ref in matches:
                # Find target article
                target = next((a for a in articles if a['article_number'] == ref), None)
                if target:
                    relationships.append({
                        'source': source_id,
                        'target': target['id'],
                        'source_article': article['article_number'],
                        'target_article': target['article_number'],
                        'type': 'references'
                    })
            
            # Find part-based relationships (same part)
            same_part = [a for a in articles 
                        if a['part_number'] == article['part_number'] 
                        and a['id'] != source_id]
            
            # Connect to nearby articles in same part (sequential relationship)
            for other in same_part[:3]:  # Limit to 3 closest
                relationships.append({
                    'source': source_id,
                    'target': other['id'],
                    'source_article': article['article_number'],
                    'target_article': other['article_number'],
                    'type': 'same_part'
                })
        
        self.normalized_data['relationships'] = relationships
        print(f"   Created {len(relationships)} relationships")
        
        return relationships
    
    def normalize_categories(self):
        """Create category index"""
        print("\n🏷️  Normalizing Categories...")
        
        category_index = defaultdict(list)
        
        for article in self.normalized_data['articles']:
            for category in article['categories']:
                category_index[category].append({
                    'article_id': article['id'],
                    'article_number': article['article_number'],
                    'provision': article['provision'][:100] + '...'  # Truncate
                })
        
        # Convert to list format
        categories = []
        for cat_name, articles in category_index.items():
            categories.append({
                'name': cat_name,
                'count': len(articles),
                'articles': articles
            })
        
        # Sort by count
        categories = sorted(categories, key=lambda x: x['count'], reverse=True)
        
        self.normalized_data['categories'] = categories
        print(f"   Created {len(categories)} category indexes")
        
        return categories
    
    def create_amendments_data(self):
        """Create amendments metadata (placeholder for future enhancement)"""
        print("\n📝 Creating Amendments Data...")
        
        # This is a placeholder structure
        # Real amendment data would need additional sources
        amendments = [
            {
                'id': 'amendment-placeholder',
                'number': 'TBD',
                'year': 'TBD',
                'description': 'Amendment data requires additional source integration',
                'articles_affected': []
            }
        ]
        
        self.normalized_data['amendments'] = amendments
        print(f"   Created amendments placeholder")
        
        return amendments
    
    def save_json(self, data, filename):
        """Save data to JSON file"""
        os.makedirs('data', exist_ok=True)
        filepath = f'data/{filename}'
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"   ✅ Saved: {filepath}")
    
    def export_all(self):
        """Export all normalized datasets"""
        print("\n💾 Exporting Normalized Data...")
        
        self.save_json(self.normalized_data['parts'], 'parts.json')
        self.save_json(self.normalized_data['articles'], 'articles.json')
        self.save_json(self.normalized_data['categories'], 'categories.json')
        self.save_json(self.normalized_data['relationships'], 'relationships.json')
        self.save_json(self.normalized_data['amendments'], 'amendments.json')
        
        # Create combined dataset
        combined = {
            'metadata': {
                'total_parts': len(self.normalized_data['parts']),
                'total_articles': len(self.normalized_data['articles']),
                'total_categories': len(self.normalized_data['categories']),
                'total_relationships': len(self.normalized_data['relationships']),
                'generated_at': pd.Timestamp.now().isoformat()
            },
            'parts': self.normalized_data['parts'],
            'articles': self.normalized_data['articles'],
            'categories': self.normalized_data['categories'],
            'relationships': self.normalized_data['relationships']
        }
        
        self.save_json(combined, 'constitution_complete.json')
        
        print("\n✅ All data exported successfully!")
    
    def run_normalization(self):
        """Run complete normalization pipeline"""
        print("\n" + "="*60)
        print("🚀 DATA NORMALIZATION PIPELINE")
        print("="*60)
        
        if not self.load_data():
            return False
        
        self.clean_data()
        self.normalize_parts()
        self.normalize_articles()
        self.build_relationships()
        self.normalize_categories()
        self.create_amendments_data()
        self.export_all()
        
        print("\n" + "="*60)
        print("✅ NORMALIZATION COMPLETE")
        print("="*60)
        
        return True


if __name__ == "__main__":
    normalizer = DataNormalizer('Indian_Constitution_Articles.csv')
    
    if normalizer.run_normalization():
        print("\n🎯 Next Steps:")
        print("   1. Check data/ folder for generated JSON files")
        print("   2. Run search_index.py to build search capabilities")
        print("   3. Move to frontend development")
