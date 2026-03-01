'use client';

import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();
  const displayPlaceholder = placeholder || t('explorer.search_placeholder');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={displayPlaceholder}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--border-medium)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#C5A047]/40 focus:border-[#C5A047]/40 shadow-sm transition-all duration-200 text-sm"
        />
      </motion.div>
    </form>
  );
}
