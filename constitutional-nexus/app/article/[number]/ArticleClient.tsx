'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Article } from '@/types';
import { DataService, SearchService, getCategoryColor } from '@/utils/dataService';
import Link from 'next/link';
import { HiArrowLeft, HiBookmark, HiShare } from 'react-icons/hi';
import { use } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function ArticleClient({ params }: { params: Promise<{ number: string }> }) {
  const resolvedParams = use(params);
  const { t, td } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  const searchService = new SearchService();

  useEffect(() => {
    loadArticle();
  }, [resolvedParams.number]);

  const loadArticle = async () => {
    try {
      const articles = await DataService.getArticles();
      searchService.setArticles(articles);

      const found = articles.find(a => a.article_number === resolvedParams.number);
      if (found) {
        setArticle(found);
        
        const related = searchService.getSimilarArticles(found, 6);
        setRelatedArticles(related);

        // Check bookmark status
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setBookmarked(bookmarks.includes(found.id));

        // Track recently viewed
        const recent = JSON.parse(localStorage.getItem('recent') || '[]');
        const updatedRecent = [found.id, ...recent.filter((id: string) => id !== found.id)].slice(0, 20);
        localStorage.setItem('recent', JSON.stringify(updatedRecent));
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = () => {
    if (!article) return;

    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    let updated;

    if (bookmarked) {
      updated = bookmarks.filter((id: string) => id !== article.id);
    } else {
      updated = [...bookmarks, article.id];
    }

    localStorage.setItem('bookmarks', JSON.stringify(updated));
    setBookmarked(!bookmarked);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-[#C5A047] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-[var(--text-primary)] mb-4">{t('article.not_found')}</h1>
          <p className="text-[var(--text-muted)] mb-6">{t('article.not_found_desc')}</p>
          <Link href="/explorer" className="btn-primary text-sm px-6 py-2.5 inline-block">
            ← {t('article.back_to_explorer')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content — 2 columns */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Link
                href="/explorer"
                className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium text-sm"
              >
                <HiArrowLeft /> {t('article.back_to_explorer')}
              </Link>
            </motion.div>

            {/* Article Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-8 md:p-12"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-[#C5A047] font-semibold text-sm uppercase tracking-wider mb-2">
                    {td('part', article.part_title)}
                  </p>
                  <h1 className="font-heading text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2">
                    {t('article.article')} {article.article_number}
                  </h1>
                  {article.chapter && (
                    <p className="text-[var(--text-muted)] text-sm mt-1">{td('part', article.chapter)}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleBookmark}
                    className={`p-3 rounded-xl transition-all border ${
                      bookmarked
                        ? 'bg-[#C5A047] text-white border-[#C5A047]'
                        : 'bg-[var(--card-solid-bg)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[#C5A047]/30 hover:text-[#C5A047]'
                    }`}
                  >
                    <HiBookmark size={20} />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-8">
                <span
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium ${
                    article.status === 'active'
                      ? 'badge-green'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {td('status', article.status.toUpperCase())}
                </span>
              </div>

              {/* Provision */}
              <div className="mb-10">
                <h2 className="font-heading text-xl font-semibold text-[var(--text-primary)] mb-4">{t('article.provision')}</h2>
                <div className="bg-[var(--provision-bg)] rounded-2xl p-6 border-gold-accent">
                  <p className="text-[var(--text-primary)] text-base leading-[1.85] font-[410]">
                    {article.provision}
                  </p>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-3">{t('article.categories')}</h3>
                <div className="flex flex-wrap gap-2">
                  {article.categories.map((category) => (
                    <span
                      key={category}
                      className={`px-3.5 py-1.5 rounded-xl text-sm font-medium ${getCategoryColor(category)}`}
                    >
                      {td('category', category)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              {article.keywords.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-3">{t('article.keywords')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1.5 bg-[var(--provision-bg)] text-[var(--text-secondary)] rounded-xl text-sm border border-[var(--border-subtle)]"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar — Metadata Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-28 space-y-6"
            >
              {/* Metadata Floating Card */}
              <div className="stat-glass rounded-2xl p-6">
                <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-5">
                  {t('article.details')}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] text-sm">{t('article.part')}</span>
                    <span className="text-[var(--text-primary)] font-semibold text-sm">{article.part_number}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] text-sm">{t('article.status')}</span>
                    <span className="text-[var(--text-primary)] font-semibold text-sm capitalize">{td('status', article.status)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] text-sm">{t('article.length')}</span>
                    <span className="text-[var(--text-primary)] font-semibold text-sm">{article.provision_length} {t('article.chars')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[var(--text-muted)] text-sm">{t('article.categories')}</span>
                    <span className="text-[var(--text-primary)] font-semibold text-sm">{article.categories.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigate */}
              <div className="stat-glass rounded-2xl p-6">
                <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-4">
                  {t('article.quick_navigate')}
                </h3>
                <div className="space-y-2">
                  <Link href="/explorer" className="block px-4 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[#C5A047]/10 hover:text-[var(--text-primary)] transition-all text-sm font-medium">
                    {t('article.all_articles')} →
                  </Link>
                  <Link href="/navigator" className="block px-4 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[#C5A047]/10 hover:text-[var(--text-primary)] transition-all text-sm font-medium">
                    {t('article.life_situations')} →
                  </Link>
                  <Link href="/timeline" className="block px-4 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[#C5A047]/10 hover:text-[var(--text-primary)] transition-all text-sm font-medium">
                    {t('article.amendment_timeline')} →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <div className="gold-line w-16 mb-8" />
            <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-6">{t('article.related')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((related, idx) => (
                <Link
                  key={related.id}
                  href={`/article/${related.article_number}`}
                  className="card-elevated p-6 card-hover hover:border-[#C5A047]/30"
                >
                  <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {t('article.article')} {related.article_number}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {related.provision}
                  </p>
                  <p className="text-[#C5A047] text-sm font-semibold mt-3">
                    {t('article.read_more')} →
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
