import React from 'react';
import { FaEdit, FaTrash, FaThumbsUp, FaThumbsDown, FaBan } from 'react-icons/fa';
import { Article } from '../../types/userData';

interface ArticleCardProps {
  article: Article;
  onEdit: () => void;
  onDelete: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h2>
      <p className="text-gray-600 mb-4">{article.description}</p>
      <p className="text-gray-600 mb-4">{article.content.substring(0, 100)}...</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">{new Date(article.date).toLocaleDateString()}</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FaThumbsUp className="text-green-500 mr-1" />
            <span>{article.likes?.length}</span>
          </div>
          <div className="flex items-center">
            <FaThumbsDown className="text-red-500 mr-1" />
            <span>{article.dislikes?.length}</span>
          </div>
          <div className="flex items-center">
            <FaBan className="text-gray-500 mr-1" />
            <span>{article.blocks?.length}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={onEdit} className="text-blue-500 hover:text-blue-600 mr-4">
          <FaEdit />
        </button>
        <button onClick={onDelete} className="text-red-500 hover:text-red-600">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;