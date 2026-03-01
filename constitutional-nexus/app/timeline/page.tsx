'use client';

import { motion } from 'framer-motion';
import { HiClock } from 'react-icons/hi';
import { useLanguage } from '@/context/LanguageContext';

export default function TimelinePage() {
  const { t } = useLanguage();

  const amendments = [
    { year: 1950, number: 0, title: t('timeline.amendment_0_title'), description: t('timeline.amendment_0_desc') },
    { year: 1951, number: 1, title: t('timeline.amendment_1_title'), description: t('timeline.amendment_1_desc') },
    { year: 1971, number: 24, title: t('timeline.amendment_24_title'), description: t('timeline.amendment_24_desc') },
    { year: 1976, number: 42, title: t('timeline.amendment_42_title'), description: t('timeline.amendment_42_desc') },
    { year: 2002, number: 86, title: t('timeline.amendment_86_title'), description: t('timeline.amendment_86_desc') },
    { year: 2019, number: 103, title: t('timeline.amendment_103_title'), description: t('timeline.amendment_103_desc') },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="gold-line w-16 mx-auto mb-6" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            {t('timeline.title')}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
            {t('timeline.subtitle')}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C5A047] via-[#C5A047]/40 to-transparent" />

          {/* Timeline Items */}
          <div className="space-y-10">
            {amendments.map((amendment, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.12 }}
                className="relative pl-20"
              >
                {/* Timeline Dot */}
                <div className="absolute left-[22px] top-3 w-[18px] h-[18px] bg-[#C5A047] rounded-full border-4 border-[var(--page-bg)] shadow-md" />

                {/* Content Card */}
                <div className="card-elevated p-6 card-hover hover:border-[#C5A047]/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-heading text-2xl font-bold text-[var(--text-primary)]">
                        {amendment.year}
                      </span>
                      {amendment.number > 0 && (
                        <span className="badge-gold text-xs">
                          {t('timeline.amendment')} {amendment.number}
                        </span>
                      )}
                    </div>
                    <HiClock className="text-[#C5A047]/60 shrink-0" size={20} />
                  </div>

                  <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {amendment.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {amendment.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 max-w-3xl mx-auto border-gold-accent rounded-2xl bg-[var(--section-alt-bg)] p-8 text-center"
        >
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {t('timeline.note')} <strong className="text-[var(--text-primary)]">{t('timeline.over_105')}</strong> {t('timeline.note_suffix')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
