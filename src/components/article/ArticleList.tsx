import React from 'react';
import { Article } from '../../types/userData';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  openModal: (article: Article) => void;
  openDeleteModal: (id: number) => void;
  isFetchingArticles: boolean;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, openModal, openDeleteModal, isFetchingArticles }) => {
  if (isFetchingArticles) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <ArticleCard key={index} article={null} onEdit={() => {}} onDelete={() => {}} isLoading={true} />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return <p className="text-center text-gray-600">No articles found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => (
        <ArticleCard
          key={article._id}
          article={article}
          onEdit={() => openModal(article)}
          onDelete={() => openDeleteModal(article._id)}
          isLoading={false}
        />
      ))}
    </div>
  );
};

export default ArticleList;