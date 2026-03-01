import fs from 'fs';
import path from 'path';
import ArticleClient from './ArticleClient';

export function generateStaticParams() {
  const articlesPath = path.join(process.cwd(), 'public', 'data', 'articles.json');
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
  return articles.map((article: { article_number: string }) => ({
    number: article.article_number,
  }));
}

export default function ArticlePage({ params }: { params: Promise<{ number: string }> }) {
  return <ArticleClient params={params} />;
}
