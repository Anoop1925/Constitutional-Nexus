'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Article } from '@/types';
import { DataService } from '@/utils/dataService';
import ArticleCard from '@/components/ArticleCard';
import { HiBookmark, HiClock } from 'react-icons/hi';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPage() {
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const articles = await DataService.getArticles();

      // Get bookmarked articles
      const bookmarkIds = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      const bookmarked = articles.filter(a => bookmarkIds.includes(a.id));
      setBookmarkedArticles(bookmarked);

      // Get recently viewed articles
      const recentIds = JSON.parse(localStorage.getItem('recent') || '[]');
      const recent = articles.filter(a => recentIds.includes(a.id)).slice(0, 6);
      setRecentArticles(recent);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="gold-line w-16 mb-6" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            {t('dashboard.title')}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            {t('dashboard.subtitle')}
          </p>
        </motion.div>

        {/* Bookmarked Articles */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#C5A047]/10 rounded-xl">
              <HiBookmark className="text-[#C5A047]" size={22} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">{t('dashboard.bookmarked')}</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-[#C5A047] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[var(--text-muted)]">{t('dashboard.loading')}</p>
            </div>
          ) : bookmarkedArticles.length === 0 ? (
            <div className="card-elevated p-12 text-center">
              <HiBookmark className="text-[#C5A047]/30 mx-auto mb-4" size={48} />
              <p className="text-[var(--text-secondary)] mb-4">{t('dashboard.no_bookmarks')}</p>
              <a
                href="/explorer"
                className="text-[#C5A047] hover:text-[#B08D3E] font-semibold text-sm"
              >
                {t('dashboard.start_exploring')}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedArticles.map((article, idx) => (
                <ArticleCard key={article.id} article={article} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* Recently Viewed */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#2B3A67]/10 rounded-xl">
              <HiClock className="text-[#2B3A67]" size={22} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">{t('dashboard.recently_viewed')}</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-[#C5A047] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[var(--text-muted)]">{t('dashboard.loading')}</p>
            </div>
          ) : recentArticles.length === 0 ? (
            <div className="card-elevated p-12 text-center">
              <HiClock className="text-[#2B3A67]/30 mx-auto mb-4" size={48} />
              <p className="text-[var(--text-secondary)]">{t('dashboard.no_recent')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article, idx) => (
                <ArticleCard key={article.id} article={article} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* Daily Insight */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-14 border-gold-accent rounded-2xl bg-[var(--section-alt-bg)] backdrop-blur-sm p-8"
        >
          <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-3">
            {t('dashboard.insight_title')}
          </h3>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {t('dashboard.insight_quote')}
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-3">
            {t('dashboard.insight_footer')}
          </p>
        </motion.section>
      </div>
    </div>
  );
}
