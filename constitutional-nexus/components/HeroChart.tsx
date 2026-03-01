'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

interface PartData {
  name: string;
  articles: number;
}

export default function HeroChart() {
  const [rawParts, setRawParts] = useState<{ number: string; title: string; article_count: number }[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetch('/data/parts.json')
      .then((res) => res.json())
      .then((parts: { number: string; title: string; article_count: number }[]) => {
        const sorted = [...parts]
          .sort((a, b) => b.article_count - a.article_count)
          .slice(0, 8);
        setRawParts(sorted);
      })
      .catch(console.error);
  }, []);

  const data = rawParts.map((p) => ({
    name: `${t('explorer.part')} ${p.number}`,
    articles: p.article_count,
  }));

  if (data.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[var(--text-primary)] text-sm font-semibold tracking-wide">
          {t('chart.articles_per_part')}
        </h4>
        <span className="text-[10px] text-[var(--text-muted)] bg-[var(--provision-bg)] px-2 py-0.5 rounded-full">
          {t('chart.top_8')}
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
              axisLine={{ stroke: 'var(--border-medium)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--card-solid-bg)',
                border: '1px solid rgba(197,160,71,0.25)',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 8px 24px rgba(14,26,43,0.1)',
                color: 'var(--text-primary)',
              }}
              cursor={{ fill: 'rgba(197,160,71,0.08)' }}
            />
            <Bar
              dataKey="articles"
              fill="url(#goldGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C5A047" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#A88A36" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
