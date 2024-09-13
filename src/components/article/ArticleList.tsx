import React from 'react';
import { Article } from '../../types/userData';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  openModal: (article: Article) => void;
  openDeleteModal: (id: number) => void;
  isArticles:any
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, openModal, openDeleteModal,isArticles }) => {
  if (articles.length === 0) {
    return <p className="text-center text-gray-600">No articles found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map(article => (
        <ArticleCard
          key={article.id}
          article={article}
          onEdit={() => openModal(article)}
          onDelete={() => openDeleteModal(article._id)}
          isArticles={isArticles}
        />
      ))}
    </div>
  );
};

export default ArticleList;
