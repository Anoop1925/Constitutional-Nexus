"""
Constitutional Nexus - CSV Analysis Module
==========================================
Analyzes the Indian Constitution CSV for data quality, structure, and patterns.
"""

import pandas as pd
import numpy as np
from collections import Counter
import json
import re

class ConstitutionAnalyzer:
    def __init__(self, csv_path):
        self.csv_path = csv_path
        self.df = None
        self.analysis_report = {}
        
    def load_data(self):
        """Load CSV file with proper encoding"""
        encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252', 'utf-8-sig']
        
        for encoding in encodings:
            try:
                self.df = pd.read_csv(self.csv_path, encoding=encoding)
                print(f"✅ CSV loaded successfully with {encoding} encoding")
                print(f"📊 Total Records: {len(self.df)}")
                return True
            except Exception as e:
                continue
        
        print(f"❌ Error loading CSV with any encoding")
        return False
    
    def analyze_schema(self):
        """Analyze column structure and data types"""
        print("\n" + "="*60)
        print("📋 SCHEMA ANALYSIS")
        print("="*60)
        
        schema_info = {}
        for col in self.df.columns:
            schema_info[col] = {
                'type': str(self.df[col].dtype),
                'non_null': int(self.df[col].count()),
                'null_count': int(self.df[col].isnull().sum()),
                'unique_values': int(self.df[col].nunique()),
                'sample_values': self.df[col].dropna().head(3).tolist()
            }
            
            print(f"\n📌 Column: {col}")
            print(f"   Type: {schema_info[col]['type']}")
            print(f"   Non-Null: {schema_info[col]['non_null']}")
            print(f"   Null Count: {schema_info[col]['null_count']}")
            print(f"   Unique Values: {schema_info[col]['unique_values']}")
            print(f"   Sample: {schema_info[col]['sample_values'][:2]}")
        
        self.analysis_report['schema'] = schema_info
        return schema_info
    
    def analyze_parts(self):
        """Analyze constitutional parts"""
        print("\n" + "="*60)
        print("🏛️  PARTS ANALYSIS")
        print("="*60)
        
        parts = self.df['Part'].dropna().unique()
        part_counts = self.df['Part'].value_counts()
        
        print(f"\n📊 Total Parts: {len(parts)}")
        print(f"\n🔝 Top 10 Parts by Article Count:")
        for part, count in part_counts.head(10).items():
            print(f"   {part[:50]}... : {count} articles")
        
        self.analysis_report['parts'] = {
            'total': len(parts),
            'list': parts.tolist(),
            'distribution': part_counts.to_dict()
        }
        
        return parts
    
    def analyze_articles(self):
        """Analyze article numbering and patterns"""
        print("\n" + "="*60)
        print("📜 ARTICLES ANALYSIS")
        print("="*60)
        
        articles = self.df['Article'].tolist()
        
        # Extract article numbers
        article_numbers = []
        omitted_count = 0
        special_articles = []
        
        for art in articles:
            if '[Omitted' in str(art) or 'Omitted' in str(art):
                omitted_count += 1
            
            # Extract numeric part
            match = re.search(r'\d+[A-Z]*', str(art))
            if match:
                num = match.group()
                article_numbers.append(num)
                if any(char.isalpha() for char in num):
                    special_articles.append(num)
        
        print(f"\n📊 Total Articles: {len(articles)}")
        print(f"🗑️  Omitted Articles: {omitted_count}")
        print(f"⭐ Special Articles (with letters): {len(special_articles)}")
        print(f"   Examples: {special_articles[:10]}")
        
        # Find duplicates
        duplicates = [item for item, count in Counter(article_numbers).items() if count > 1]
        if duplicates:
            print(f"\n⚠️  Duplicate Article Numbers: {duplicates}")
        else:
            print("\n✅ No duplicate article numbers")
        
        self.analysis_report['articles'] = {
            'total': len(articles),
            'omitted': omitted_count,
            'special': special_articles,
            'duplicates': duplicates
        }
        
        return article_numbers
    
    def analyze_chapters(self):
        """Analyze chapter structure"""
        print("\n" + "="*60)
        print("📚 CHAPTERS ANALYSIS")
        print("="*60)
        
        chapters = self.df['Chapter'].dropna()
        unique_chapters = chapters.unique()
        
        print(f"\n📊 Records with Chapters: {len(chapters)}")
        print(f"📊 Unique Chapters: {len(unique_chapters)}")
        print(f"📊 Records without Chapters: {self.df['Chapter'].isnull().sum()}")
        
        if len(unique_chapters) > 0:
            print(f"\n🔍 Sample Chapters:")
            for ch in unique_chapters[:5]:
                print(f"   {ch}")
        
        self.analysis_report['chapters'] = {
            'total_with_chapters': len(chapters),
            'unique_chapters': len(unique_chapters),
            'chapters_list': unique_chapters.tolist()
        }
        
        return unique_chapters
    
    def analyze_provisions(self):
        """Analyze provision text"""
        print("\n" + "="*60)
        print("📝 PROVISIONS ANALYSIS")
        print("="*60)
        
        provisions = self.df['Provision'].dropna()
        
        # Calculate text statistics
        avg_length = provisions.apply(len).mean()
        max_length = provisions.apply(len).max()
        min_length = provisions.apply(len).min()
        
        print(f"\n📊 Total Provisions: {len(provisions)}")
        print(f"📏 Average Length: {avg_length:.0f} characters")
        print(f"📏 Max Length: {max_length} characters")
        print(f"📏 Min Length: {min_length} characters")
        
        # Find keyword patterns
        keywords = ['right', 'freedom', 'protection', 'power', 'duty', 'prohibition']
        keyword_counts = {}
        
        print(f"\n🔍 Keyword Analysis:")
        for keyword in keywords:
            count = provisions.str.contains(keyword, case=False).sum()
            keyword_counts[keyword] = int(count)
            print(f"   '{keyword}': {count} provisions")
        
        self.analysis_report['provisions'] = {
            'total': len(provisions),
            'avg_length': float(avg_length),
            'max_length': int(max_length),
            'min_length': int(min_length),
            'keyword_counts': keyword_counts
        }
        
        return provisions
    
    def detect_relationships(self):
        """Detect potential relationships between articles"""
        print("\n" + "="*60)
        print("🔗 RELATIONSHIP DETECTION")
        print("="*60)
        
        relationships = []
        
        # Find articles that reference other articles
        for idx, row in self.df.iterrows():
            provision = str(row['Provision'])
            article = row['Article']
            
            # Look for article references in provision text
            matches = re.findall(r'article[s]?\s+(\d+[A-Z]*)', provision, re.IGNORECASE)
            if matches:
                for ref in matches:
                    relationships.append({
                        'source': article,
                        'target': f'Article {ref}',
                        'type': 'references'
                    })
        
        print(f"\n🔗 Cross-references found: {len(relationships)}")
        if relationships:
            print(f"\n🔍 Sample Relationships:")
            for rel in relationships[:5]:
                print(f"   {rel['source']} → {rel['target']}")
        
        self.analysis_report['relationships'] = {
            'total': len(relationships),
            'samples': relationships[:20]
        }
        
        return relationships
    
    def generate_categories(self):
        """Generate categories based on content analysis"""
        print("\n" + "="*60)
        print("🏷️  CATEGORY GENERATION")
        print("="*60)
        
        categories = {
            'Rights': ['right', 'freedom', 'liberty', 'equality'],
            'Powers': ['power', 'authority', 'jurisdiction'],
            'Duties': ['duty', 'obligation', 'responsibility'],
            'Prohibitions': ['prohibition', 'unlawful', 'not', 'bar'],
            'Procedures': ['procedure', 'process', 'manner', 'method'],
            'Definitions': ['definition', 'meaning', 'interpretation'],
            'Protections': ['protection', 'safeguard', 'security'],
            'Provisions': ['provision', 'special', 'temporary']
        }
        
        article_categories = {}
        
        for idx, row in self.df.iterrows():
            provision = str(row['Provision']).lower()
            article = row['Article']
            matched_categories = []
            
            for category, keywords in categories.items():
                if any(keyword in provision for keyword in keywords):
                    matched_categories.append(category)
            
            if not matched_categories:
                matched_categories = ['General']
            
            article_categories[article] = matched_categories
        
        # Count articles per category
        category_counts = {}
        for cats in article_categories.values():
            for cat in cats:
                category_counts[cat] = category_counts.get(cat, 0) + 1
        
        print(f"\n📊 Category Distribution:")
        for cat, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
            print(f"   {cat}: {count} articles")
        
        self.analysis_report['categories'] = {
            'category_counts': category_counts,
            'article_categories': article_categories
        }
        
        return article_categories
    
    def save_report(self, output_path='data/analysis_report.json'):
        """Save analysis report to JSON"""
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.analysis_report, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Analysis report saved to: {output_path}")
    
    def run_full_analysis(self):
        """Run complete analysis pipeline"""
        print("\n" + "="*60)
        print("🚀 CONSTITUTIONAL NEXUS - DATA ANALYSIS")
        print("="*60)
        
        if not self.load_data():
            return False
        
        self.analyze_schema()
        self.analyze_parts()
        self.analyze_articles()
        self.analyze_chapters()
        self.analyze_provisions()
        self.detect_relationships()
        self.generate_categories()
        
        print("\n" + "="*60)
        print("✅ ANALYSIS COMPLETE")
        print("="*60)
        
        return True


if __name__ == "__main__":
    analyzer = ConstitutionAnalyzer('Indian_Constitution_Articles.csv')
    
    if analyzer.run_full_analysis():
        # Create data directory if it doesn't exist
        import os
        os.makedirs('data', exist_ok=True)
        
        # Save report
        analyzer.save_report()
        
        print("\n🎯 Next Steps:")
        print("   1. Run normalize_data.py to clean and structure data")
        print("   2. Run search_index.py to build search indexes")
        print("   3. Build frontend with Next.js")
