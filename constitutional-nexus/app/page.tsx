'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import ArticleCard from '@/components/ArticleCard';
import HeroChart from '@/components/HeroChart';
import { Article } from '@/types';
import { DataService } from '@/utils/dataService';
import Link from 'next/link';
import Image from 'next/image';
import { HiLightningBolt, HiSearch, HiChartBar, HiBookOpen, HiDocumentText, HiCollection, HiScale } from 'react-icons/hi';
import { useLanguage } from '@/context/LanguageContext';
import { BASE_PATH } from '@/utils/dataService';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await DataService.getArticles();
      setArticles(data);
      
      const featured = data
        .filter(a => a.categories.includes('Fundamental Rights') && a.status === 'active')
        .slice(0, 6);
      setFeaturedArticles(featured);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    window.location.href = `${BASE_PATH}/explorer?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════
          HERO SECTION — Cinematic, Immersive
      ═══════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[70%] h-[70%] bg-gradient-radial from-[#C5A047]/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-radial from-[#2B3A67]/6 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[30%] w-[30%] h-[30%] bg-gradient-radial from-[#C5A047]/5 via-transparent to-transparent rounded-full blur-2xl" />
        </div>

        {/* Content wrapper — wider layout, reduced horizontal padding */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-24 pb-0 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-0 items-start min-h-[90vh]">

            {/* ─── LEFT COLUMN — Text (5 cols) ─── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="lg:col-span-5 flex flex-col justify-center pt-4 lg:pt-8 pb-12 space-y-8"
            >
              {/* Headline — 3 dramatic lines */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="font-heading font-black tracking-tight hero-headline"
                >
                  <span className="block text-[var(--text-primary)] mb-1">{t('hero.line1')}</span>
                  <span className="block text-[var(--text-primary)] hero-headline-large mb-1">{t('hero.line2')}</span>
                  <span className="block">
                    <span className="gradient-text-gold">{t('hero.line3')}</span>
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.7 }}
                  className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-md leading-relaxed"
                >
                  {t('hero.subtitle')}
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/explorer" className="btn-primary text-base px-9 py-3.5 inline-block">
                  {t('hero.explore_articles')}
                </Link>
                <Link href="/navigator" className="btn-outline text-base px-9 py-3.5 inline-block">
                  {t('hero.learn_more')}
                </Link>
              </motion.div>

              {/* ── Analytics Bar (below buttons) ── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className="analytics-bar"
              >
                {[
                  { icon: HiDocumentText, value: '395+', label: t('hero.articles') },
                  { icon: HiCollection, value: '22', label: t('hero.parts') },
                  { icon: HiScale, value: '105+', label: t('hero.amendments') },
                ].map((stat, idx) => (
                  <div key={stat.label} className="flex items-center gap-3.5">
                    <div className="analytics-icon-wrap">
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="font-heading text-2xl font-bold text-[var(--text-primary)] leading-none">{stat.value}</p>
                      <p className="text-xs text-[var(--text-muted)] font-medium mt-1">{stat.label}</p>
                    </div>
                    {idx < 2 && <div className="analytics-divider" />}
                  </div>
                ))}
              </motion.div>

            </motion.div>

            {/* ─── RIGHT COLUMN — Statue + Overlays (7 cols) — HIDDEN on mobile ─── */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
              className="hidden lg:flex lg:col-span-7 relative justify-center lg:justify-center items-end min-h-[60vh] lg:min-h-[90vh] lg:-ml-15"
            >
              {/* Glow backdrop */}
              <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-gradient-radial from-[#C5A047]/12 via-[#C5A047]/4 to-transparent rounded-full blur-3xl pulse-soft pointer-events-none" />

              {/* Statue — monumental, dominates right side */}
              <div className="relative z-10 statue-container">
                {/* ▼ MANUAL ADJUST: change the style width below to resize.
                     Try: 500px | 550px | 600px | 650px | 700px | 750px | 800px
                     The height auto-scales to maintain aspect ratio. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${BASE_PATH}/Statue_lady.png`}
                  alt="Lady Justice - Symbol of Constitutional Law"
                  width={1200}
                  height={1500}
                  className="object-contain"
                  style={{
                    marginTop: '-100px',
                    width: '900px',
                    height: 'auto',
                    filter: 'drop-shadow(0 24px 64px rgba(14,26,43,0.25)) drop-shadow(0 8px 24px rgba(14,26,43,0.15))',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 75%, transparent 98%), linear-gradient(to bottom, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 75%, transparent 98%)',
                    maskComposite: 'intersect',
                  }}
                />
              </div>

              {/* ── Floating Stat: Articles (right of head) ──
                   MANUAL ADJUST: top-8 controls vertical position (lower number = higher up)
                   right-4 / lg:right-2 / xl:right-8 controls horizontal position
                   Change top-8 → top-4 to go higher, top-12 to go lower */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.7, ease: 'easeOut' }}
                className="absolute top-8 right-4 lg:top-10 lg:right-2 xl:right-8 stat-card-hero z-20"
              >
                <p className="font-heading text-3xl font-bold text-[var(--text-primary)]">395<sup className="text-[#C5A047] text-lg">+</sup></p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">{t('hero.articles_indexed')}</p>
              </motion.div>

              {/* ── Graph Card (bottom-left of statue) ── */}
                {/* MANUAL ADJUST: tweak bottom/left values to reposition graph
                   e.g. bottom-16, left-[-20px], lg:bottom-24, lg:left-[-40px] */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.8, ease: 'easeOut' }}
                className="absolute bottom-16 left-[-20px] lg:bottom-10 lg:left-[-40px] xl:left-[490px] chart-card-hero z-30 hidden sm:block"
              >
                <HeroChart />
              </motion.div>

              {/* ── Mini Info Card (lower-left, layering depth) ── */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          QUICK ACCESS SECTION
      ═══════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          {/* Decorative line */}
          <div className="gold-line w-24 mx-auto mb-12" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
              {t('quick.title')}
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
              {t('quick.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {[
              { href: '/explorer', icon: HiSearch, label: t('quick.explore'), desc: t('quick.explore_desc'), color: '#2B3A67' },
              { href: '/navigator', icon: HiLightningBolt, label: t('quick.navigator'), desc: t('quick.navigator_desc'), color: '#C5A047' },
              { href: '/timeline', icon: HiChartBar, label: t('quick.timeline'), desc: t('quick.timeline_desc'), color: '#0E1A2B' },
              { href: '/dashboard', icon: HiBookOpen, label: t('quick.dashboard'), desc: t('quick.dashboard_desc'), color: '#A88A36' },
            ].map((item, idx) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Link href={item.href} className="card-elevated p-6 card-hover text-center block hover:border-[#C5A047]/30">
                  <item.icon className="mx-auto mb-3" size={32} style={{ color: item.color }} />
                  <h3 className="text-[var(--text-primary)] font-semibold mb-1">{item.label}</h3>
                  <p className="text-[var(--text-muted)] text-xs">{item.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURED ARTICLES
      ═══════════════════════════════════════ */}
      <section className="py-20 px-4 bg-[var(--section-alt-bg)]">
        <div className="max-w-[1280px] mx-auto">
          <div className="gold-line w-24 mx-auto mb-12" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
              {t('featured.title')}
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
              {t('featured.subtitle')}
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center text-[var(--text-muted)] py-12">
              <div className="w-8 h-8 border-3 border-[#C5A047] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              {t('explorer.loading')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article, idx) => (
                <ArticleCard key={article.id} article={article} index={idx} />
              ))}
            </div>
          )}

          {/* View All CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/explorer" className="btn-outline text-sm px-8 py-3 inline-block">
              {t('featured.view_all')} {articles.length} {t('featured.articles_suffix')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROTECTING EVERY RIGHT SECTION
      ═══════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="card-elevated p-12 md:p-16 text-center border-gold-accent"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
              {t('protect.title_1')}{' '}
              <span className="gradient-text-gold italic">{t('protect.title_2')}</span>{' '}
              {t('protect.title_3')}
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {t('protect.subtitle')}
            </p>
            <Link href="/explorer" className="btn-primary text-base px-10 py-4 inline-block">
              {t('protect.get_started')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="py-12 px-4 border-t border-[var(--border-subtle)]">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
            {t('footer.name')}
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            {t('footer.tagline')}
          </p>
        </div>
      </footer>
    </div>
  );
}
