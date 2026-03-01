'use client';

import { motion } from 'framer-motion';
import { Article } from '@/types';
import { getCategoryColor } from '@/utils/dataService';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface ArticleCardProps {
  article: Article;
  index?: number;
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const { t, td } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-hover"
    >
      <Link href={`/article/${article.article_number}`}>
        <div className="card-elevated p-6 h-full hover:border-[#C5A047]/30 transition-all">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-[var(--text-primary)]">
                {t('article.article')} {article.article_number}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {td('part', article.part_title)}
              </p>
            </div>
            <span
              className={`px-2.5 py-1 text-xs rounded-lg font-medium ${
                article.status === 'active'
                  ? 'badge-green'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {td('status', article.status)}
            </span>
          </div>

          {/* Provision */}
          <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3 leading-relaxed">
            {article.provision}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className={`px-2.5 py-1 text-xs rounded-lg ${getCategoryColor(category)}`}
              >
                {td('category', category)}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">{td('part', article.chapter || '') || t('common.general')}</span>
            <span className="text-[#C5A047] font-semibold hover:text-[#A88A36]">
              {t('article.read_more')} →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
