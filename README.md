# 🏛️ Constitutional Nexus

> **The Intelligent Interface to Indian Law**

A modern, data-driven, and citizen-empowering platform for exploring the Indian Constitution. Built with engineering excellence.

![Status](https://img.shields.io/badge/status-production-green)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)

---

## 🎯 Project Vision

**Constitutional Nexus** is not just another law browsing website. It's a comprehensive constitutional intelligence engine that combines:

- ✨ **Data Engineering** - CSV-driven architecture with normalized datasets
- 🔍 **Smart Search** - Token-based indexing with fuzzy matching
- 🎨 **Futuristic UI** - Glassmorphism, gradients, and micro-interactions
- 👥 **Citizen Focus** - Life situation navigation and accessible language
- 📊 **Analytics Ready** - Relationship graphs and category insights

---

## 🏗️ Architecture

### Three-Layer Design

```
┌─────────────────────────────────────────────────────┐
│           Layer 1: Python Data Engine               │
│  ├── analyze_csv.py (Data Analysis)                 │
│  ├── normalize_data.py (Data Cleaning)              │
│  └── search_index.py (Index Builder)                │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│         Layer 2: Static Data Layer (JSON)           │
│  ├── articles.json (488 articles)                   │
│  ├── parts.json (26 parts)                          │
│  ├── categories.json (16 categories)                │
│  ├── relationships.json (1454 links)                │
│  └── search_index.json (Full-text search)           │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│          Layer 3: Frontend (Next.js + React)        │
│  ├── Home (Hero + Featured)                         │
│  ├── Explorer (Search + Filter)                     │
│  ├── Article View (Detail + Relations)              │
│  ├── Navigator (Life Situations)                    │
│  ├── Timeline (Amendments)                          │
│  └── Dashboard (Bookmarks + Recent)                 │
└─────────────────────────────────────────────────────┘
```

**Key Benefit:** Fully serverless, zero backend, pure data architecture.

---

## 📊 Data Engineering Pipeline

### 1. CSV Analysis
```bash
python scripts/analyze_csv.py
```
**Output:**
- Schema validation
- Data quality reports
- Relationship detection
- Category generation
- `data/analysis_report.json`

### 2. Data Normalization
```bash
python scripts/normalize_data.py
```
**Output:**
- Cleaned articles (488)
- Structured parts (26)
- Category indexes (16)
- Relationship graphs (1454)
- Complete dataset JSON

### 3. Search Index Building
```bash
python scripts/search_index.py
```
**Output:**
- Token mapping (1130 tokens)
- Fuzzy search patterns
- Category indexes
- Life situation mappings
- `data/search_index.json` (1.19 MB)

---

## 🎨 Design System

### Color Palette
- **Primary:** Deep Navy (`#0a1128`)
- **Accent:** Indigo to Purple gradient
- **Secondary:** Gold (`#d4af37`)
- **Text:** Ivory (`#f5f5f0`)

### UI Features
- 🌌 **Glassmorphism** - Frosted glass effects
- 🎭 **Gradients** - Multi-color text and backgrounds
- 💫 **Animations** - Smooth Framer Motion transitions
- 🎯 **Responsive** - Mobile-first design
- ✨ **Micro-interactions** - Hover effects and state changes

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ with pandas

### Installation

1. **Clone the repository**
```bash
cd LexBharat
```

2. **Run Python data pipeline**
```bash
pip install -r requirements.txt
python scripts/analyze_csv.py
python scripts/normalize_data.py
python scripts/search_index.py
```

3. **Install and run Next.js frontend**
```bash
cd constitutional-nexus
npm install
npm run dev
```

4. **Open browser**
```
http://localhost:3000
```

---

## 📁 Project Structure

```
LexBharat/
├── Indian_Constitution_Articles.csv    # Source data
├── requirements.txt                    # Python dependencies
├── scripts/                            # Data processing
│   ├── analyze_csv.py
│   ├── normalize_data.py
│   └── search_index.py
├── data/                               # Generated datasets
│   ├── articles.json
│   ├── parts.json
│   ├── categories.json
│   ├── relationships.json
│   └── search_index.json
└── constitutional-nexus/               # Next.js frontend
    ├── app/                            # Pages
    │   ├── page.tsx                    # Home
    │   ├── explorer/                   # Explorer
    │   ├── article/[number]/           # Article detail
    │   ├── navigator/                  # Life situations
    │   ├── timeline/                   # Amendments
    │   └── dashboard/                  # User dashboard
    ├── components/                     # React components
    │   ├── Navigation.tsx
    │   ├── SearchBar.tsx
    │   └── ArticleCard.tsx
    ├── types/                          # TypeScript types
    └── utils/                          # Helper functions
```

---

## 🎯 Features

### 🔍 Explorer
- **Smart Search:** Token-based full-text search
- **Filters:** By category, part, and status
- **Results:** 488 articles with live filtering

### 📜 Article View
- **Detailed Information:** Full provision text
- **Metadata:** Categories, keywords, part info
- **Related Articles:** Smart recommendations
- **Bookmarking:** Local storage persistence

### 🧭 Life Navigator
- **Scenario-Based:** 8 common situations
- **Quick Access:** Direct links to relevant articles
- **Category Mapping:** Automatically organized

### 📅 Timeline
- **Historical View:** Major amendments
- **Visual Timeline:** Interactive display
- **Context:** Before/after comparisons

### 📊 Dashboard
- **Bookmarks:** Saved articles
- **Recent:** Browse history
- **Insights:** Daily constitutional facts

---

## 🧠 Technical Highlights

### Data Engineering
- ✅ CSV parsing with encoding detection
- ✅ Duplicate detection and cleaning
- ✅ Automatic categorization (16 categories)
- ✅ Cross-reference extraction
- ✅ Relationship graph building
- ✅ Search index optimization

### Frontend Engineering
- ✅ TypeScript strict mode
- ✅ Client-side data fetching
- ✅ Local storage for persistence
- ✅ Responsive grid layouts
- ✅ Lazy loading and code splitting
- ✅ Framer Motion animations
- ✅ Custom hooks and utilities

### Search Technology
- ✅ Token-based indexing (1130 tokens)
- ✅ Fuzzy matching (1665 patterns)
- ✅ Category indexes (16 categories)
- ✅ Part indexes (26 parts)
- ✅ Article number lookup
- ✅ Multi-field search

---

## 📈 Statistics

- **Total Articles:** 488
- **Active Articles:** 465
- **Omitted Articles:** 23
- **Parts:** 26
- **Categories:** 16
- **Relationships:** 1454
- **Search Tokens:** 1130
- **Life Situations:** 8

---

## 🛠️ Technology Stack

### Backend (Data)
- Python 3.x
- Pandas
- JSON

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- React Icons

---

## 🎓 Educational Value

This project demonstrates:
1. **Data Engineering:** CSV → Structured JSON pipeline
2. **Frontend Development:** Modern React with TypeScript
3. **UI/UX Design:** Futuristic, accessible interface
4. **Search Implementation:** Custom indexing without databases
5. **State Management:** Local storage and React hooks
6. **Performance:** Static generation and client-side filtering

---

## 🚀 Deployment

### Production Build
```bash
cd constitutional-nexus
npm run build
npm start
```

### Deploy to Vercel
```bash
vercel deploy
```

### Static Export
```bash
npm run build
# Deploy the 'out' folder to any static host
```

---

## 📝 License

This project is built for educational and civic purposes.

---

## 👥 Contributing

This is a demonstration project showcasing engineering excellence in civic tech.

---

## 🎯 Future Enhancements

- [ ] Amendment detail pages with before/after comparison
- [ ] Interactive relationship graph visualization (D3.js)
- [ ] AI-powered article summaries
- [ ] Multi-language support
- [ ] Export to PDF functionality
- [ ] Advanced analytics dashboard
- [ ] User accounts and cloud sync
- [ ] API for third-party integrations

---

## 📞 Contact

Built with ❤️ for democracy and citizen empowerment.

**Constitutional Nexus** - *The Intelligent Interface to Indian Law*

---

### 🌟 Key Takeaway

This is not a student project. This is an **engineering-grade civic intelligence platform** built with:
- Professional data architecture
- Modern frontend stack
- Production-ready code
- Scalable design patterns
- User-centric features

**Built like engineers. Not like students.**
