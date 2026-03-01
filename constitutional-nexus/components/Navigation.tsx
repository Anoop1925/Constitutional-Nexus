'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.explorer'), href: '/explorer' },
    { name: t('nav.timeline'), href: '/timeline' },
    { name: t('nav.navigator'), href: '/navigator' },
    { name: t('nav.dashboard'), href: '/dashboard' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#C5A047] to-[#A88A36] rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">⚖️</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-xl font-bold text-[var(--text-primary)] tracking-wide">
                {t('nav.brand')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 font-medium text-sm tracking-wide"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side: CTA + Toggles */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/explorer"
              className="btn-primary text-sm px-5 py-2.5 inline-block"
            >
              {t('nav.explore_now')}
            </Link>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 border border-[var(--border-medium)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] hover:border-[#C5A047]/40"
              title={language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
            >
              {language === 'en' ? 'हि' : 'EN'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all duration-200 border border-[var(--border-medium)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] hover:border-[#C5A047]/40"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <HiMoon size={18} /> : <HiSun size={18} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Language Toggle (Mobile) */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border border-[var(--border-medium)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
            >
              {language === 'en' ? 'हि' : 'EN'}
            </button>

            {/* Theme Toggle (Mobile) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all border border-[var(--border-medium)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
            >
              {theme === 'light' ? <HiMoon size={16} /> : <HiSun size={16} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 space-y-1 border-t border-[var(--border-subtle)] bg-[var(--page-bg)]/95 backdrop-blur-xl rounded-b-2xl -mx-4 px-4 shadow-lg"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 px-4">
              <Link
                href="/explorer"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-sm px-5 py-2.5 inline-block w-full text-center"
              >
                {t('nav.explore_now')}
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
