'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DataService } from '@/utils/dataService';
import { LifeSituation, SearchIndex } from '@/types';
import Link from 'next/link';
import { HiLightningBolt } from 'react-icons/hi';
import { useLanguage } from '@/context/LanguageContext';

export default function NavigatorPage() {
  const [situations, setSituations] = useState<LifeSituation[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, td } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const searchIndex: SearchIndex = await DataService.getSearchIndex();
      setSituations(searchIndex.life_situations || []);
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
          className="text-center mb-14"
        >
          <div className="gold-line w-16 mx-auto mb-6" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            {t('navigator.title')}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            {t('navigator.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-3 border-[#C5A047] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">{t('navigator.loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {situations.map((situation, idx) => (
              <motion.div
                key={situation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="card-elevated p-6 card-hover hover:border-[#C5A047]/30"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#C5A047]/10 rounded-xl shrink-0">
                    <HiLightningBolt className="text-[#C5A047]" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-xl font-semibold text-[var(--text-primary)] mb-2">
                      {td('situation_title', situation.title)}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">{td('situation_desc', situation.title)}</p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {situation.categories.map((cat) => (
                        <span
                          key={cat}
                          className="badge-indigo text-xs"
                        >
                          {td('category', cat)}
                        </span>
                      ))}
                    </div>

                    {/* Articles */}
                    <div className="flex flex-wrap gap-2">
                      {situation.articles.map((articleNum) => (
                        <Link
                          key={articleNum}
                          href={`/article/${articleNum}`}
                          className="px-3 py-1.5 bg-[#C5A047] text-white text-xs font-semibold rounded-xl hover:bg-[#B08D3E] transition-all shadow-sm"
                        >
                          {t('common.article')} {articleNum}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
