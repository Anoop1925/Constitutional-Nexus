'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import ArticleCard from '@/components/ArticleCard';
import { Article, Category, Part } from '@/types';
import { DataService } from '@/utils/dataService';
import { HiFilter, HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useLanguage } from '@/context/LanguageContext';

const ITEMS_PER_PAGE = 15;

export default function ExplorerPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { t, td } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, selectedCategory, selectedPart, articles]);

  const loadData = async () => {
    try {
      const [articlesData, categoriesData, partsData] = await Promise.all([
        DataService.getArticles(),
        DataService.getCategories(),
        DataService.getParts(),
      ]);
      
      setArticles(articlesData);
      setFilteredArticles(articlesData);
      setCategories(categoriesData);
      setParts(partsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let results = [...articles];

    // Apply category filter
    if (selectedCategory) {
      results = results.filter(a => a.categories.includes(selectedCategory));
    }

    // Apply part filter
    if (selectedPart) {
      results = results.filter(a => a.part_number === selectedPart);
    }

    // Apply text search
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      const tokens = queryLower.split(/\s+/).filter(t => t.length > 1);
      if (tokens.length > 0) {
        results = results.filter(article => {
          const searchText = `${article.article_number} ${article.provision} ${article.part_title}`.toLowerCase();
          return tokens.some(token => searchText.includes(token));
        });
      }
    }

    setFilteredArticles(results);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const hasFilters = searchQuery || selectedCategory || selectedPart;

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="gold-line w-16 mx-auto mb-8" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            {t('explorer.title')}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            {t('explorer.subtitle_prefix')} {articles.length} {t('explorer.subtitle_suffix')}
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiFilter className="text-[#C5A047]" size={20} />
              <h3 className="text-[var(--text-primary)] font-semibold">{t('explorer.filters')}</h3>
            </div>
            {hasFilters && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedPart('');
                }}
                className="flex items-center gap-1 text-sm text-[#C5A047] hover:text-[#A88A36] font-medium transition-colors"
              >
                <HiX size={16} />
                {t('explorer.clear_all')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2 font-medium">{t('explorer.category')}</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--border-medium)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#C5A047]/50 focus:ring-2 focus:ring-[#C5A047]/10 transition-all"
              >
                <option value="">{t('explorer.all_categories')}</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {td('category', cat.name)} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Part Filter */}
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2 font-medium">{t('explorer.part')}</label>
              <select
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--border-medium)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#C5A047]/50 focus:ring-2 focus:ring-[#C5A047]/10 transition-all"
              >
                <option value="">{t('explorer.all_parts')}</option>
                {parts.map((part) => (
                  <option key={part.id} value={part.number}>
                    {t('explorer.part')} {part.number}: {td('part', part.title)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-[var(--text-secondary)] text-sm">
            {t('explorer.showing')} <span className="font-semibold text-[var(--text-primary)]">{startIndex + 1}–{Math.min(endIndex, filteredArticles.length)}</span> {t('explorer.of')} {filteredArticles.length} {t('explorer.articles')}
          </p>
          {totalPages > 1 && (
            <p className="text-[var(--text-muted)] text-sm">
              {t('explorer.page')} {currentPage} {t('explorer.of')} {totalPages}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-3 border-[#C5A047] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">{t('explorer.loading')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((article, idx) => (
                <ArticleCard key={article.id} article={article} index={idx} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-2">
                {/* Previous */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:shadow-sm"
                >
                  <HiChevronLeft size={18} />
                  {t('explorer.prev')}
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, idx) =>
                    page === 'ellipsis' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 py-2 text-[var(--text-muted)] text-sm">…</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`min-w-[40px] h-10 rounded-xl text-sm font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-[#C5A047] text-white shadow-md shadow-[#C5A047]/25'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:shadow-sm'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                {/* Next */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:shadow-sm"
                >
                  {t('explorer.next')}
                  <HiChevronRight size={18} />
                </button>
              </nav>
            )}
          </>
        )}

        {filteredArticles.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-[var(--text-muted)] text-lg mb-2">{t('explorer.no_articles')}</p>
            <p className="text-[var(--text-muted)] text-sm mb-6">{t('explorer.try_adjusting')}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedPart('');
              }}
              className="btn-primary text-sm px-6 py-2.5"
            >
              {t('explorer.clear_filters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
