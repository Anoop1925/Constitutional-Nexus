# Constitutional Nexus - Data Engineering Scripts

## Overview

These Python scripts transform raw constitutional CSV data into structured, searchable JSON datasets for the frontend.

## Scripts

### 1. analyze_csv.py
**Purpose**: Analyze CSV structure and generate insights
- Schema analysis
- Data quality checks
- Relationship detection
- Category generation
- Output: `data/analysis_report.json`

### 2. normalize_data.py
**Purpose**: Clean and normalize data into structured JSON
- Data cleaning
- Standardization
- Relationship mapping
- Category indexing
- Outputs:
  - `data/parts.json`
  - `data/articles.json`
  - `data/categories.json`
  - `data/relationships.json`
  - `data/constitution_complete.json`

### 3. search_index.py
**Purpose**: Build search indexes for fast client-side searching
- Token indexing
- Fuzzy search patterns
- Category indexes
- Part indexes
- Quick filters
- Life situation mappings
- Output: `data/search_index.json`

## Usage

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Complete Pipeline
```bash
python scripts/analyze_csv.py
python scripts/normalize_data.py
python scripts/search_index.py
```

Or run individually:
```bash
# Step 1: Analyze
python scripts/analyze_csv.py

# Step 2: Normalize
python scripts/normalize_data.py

# Step 3: Index
python scripts/search_index.py
```

## Output Structure

```
data/
├── analysis_report.json      # Analysis insights
├── parts.json                 # Normalized parts
├── articles.json              # Normalized articles
├── categories.json            # Category index
├── relationships.json         # Article relationships
├── search_index.json          # Search capabilities
└── constitution_complete.json # Complete dataset
```

## Data Schema

### Article Object
```json
{
  "id": "article-1",
  "article_number": "1",
  "article_text": "Article 1",
  "provision": "Name and territory of the Union.",
  "part_number": "1",
  "part_title": "THE UNION AND ITS TERRITORY",
  "chapter": null,
  "status": "active",
  "categories": ["Union Powers"],
  "keywords": ["name", "territory", "union"]
}
```

### Search Index Structure
```json
{
  "token_map": {},          // Token -> Article IDs
  "article_tokens": {},     // Article ID -> Tokens
  "fuzzy_index": {},        // Fuzzy matching patterns
  "category_index": {},     // Category -> Articles
  "part_index": {},         // Part -> Articles
  "article_number_index": {}, // Direct article lookup
  "quick_filters": {},      // Predefined filters
  "life_situations": []     // Citizen scenarios
}
```

## Features

- 🧹 **Data Cleaning**: Removes duplicates, standardizes formatting
- 🔗 **Relationship Detection**: Identifies cross-references
- 🏷️ **Auto-Categorization**: Intelligent category assignment
- 🔍 **Search Indexing**: Token-based full-text search
- 🎯 **Life Situations**: Citizen-friendly scenario mapping
- ⚡ **Quick Filters**: Common query shortcuts

## Next Steps

After running these scripts:
1. Check `data/` folder for generated files
2. Move to frontend development (Next.js)
3. Use generated JSON in React components
4. No backend or database needed!
