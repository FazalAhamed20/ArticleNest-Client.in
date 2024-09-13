import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, X, Shield, Calendar, Tag, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import baseAxios from '../../config/axiosInstance';
import ConfirmationModal from '../../utils/modal/confirmationModal';


interface Article {
  _id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  author: string;
  likes: string[];
  dislikes: string[];
  isBlocked: boolean;
  blocks: string[]; 
  image: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
const [articleToBlock, setArticleToBlock] = useState<string | null>(null);
  const articlesPerPage = 9;
  const preferences = useSelector((state: any) => state.auth.user?.user.preferences);

  useEffect(() => {
    const userId =   useSelector((state: any) => state.auth.user?.user._id);
    setCurrentUserId( userId);
    fetchAllArticles();
  }, []);

  const fetchAllArticles = async () => {
    setLoading(true);
    try {
      const result = await baseAxios.get('/all-articles');
      setArticles(result.data.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortArticlesByPreference = (articles: Article[]) => {
    return articles.sort((a, b) => {
      const aInPreferences = preferences?.includes(a.category) ? 1 : 0;
      const bInPreferences = preferences?.includes(b.category) ? 1 : 0;
      return bInPreferences - aInPreferences;
    });
  };

  const filteredAndSortedArticles = useMemo(() => {
    let filteredArticles = articles;

    if (selectedCategory) {
      filteredArticles = filteredArticles.filter(article => article.category === selectedCategory);
    }

    return sortArticlesByPreference(filteredArticles);
  }, [articles, selectedCategory, preferences]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredAndSortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const updateArticleState = (articleId: string, updateFn: (article: Article) => Article) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article._id === articleId ? updateFn(article) : article
      )
    );
    if (selectedArticle && selectedArticle._id === articleId) {
      setSelectedArticle(updateFn(selectedArticle));
    }
  };

  const handleLike = async (articleId: string) => {
    if (!currentUserId) return;
    const isLiked = articles.find(a => a._id === articleId)?.likes.includes(currentUserId);
    updateArticleState(articleId, article => ({
      ...article,
      likes: isLiked 
        ? article.likes.filter(id => id !== currentUserId)
        : [...article.likes, currentUserId],
      dislikes: article.dislikes.filter(id => id !== currentUserId)
    }));

    try {
      await baseAxios.post(`/like-article/${articleId}`, { userId: currentUserId });
    } catch (error) {
      console.error('Error liking article:', error);
      fetchAllArticles();
    }
  };

  const handleDislike = async (articleId: string) => {
    if (!currentUserId) return;
    const isDisliked = articles.find(a => a._id === articleId)?.dislikes.includes(currentUserId);
    updateArticleState(articleId, article => ({
      ...article,
      dislikes: isDisliked 
        ? article.dislikes.filter(id => id !== currentUserId)
        : [...article.dislikes, currentUserId],
      likes: article.likes.filter(id => id !== currentUserId)
    }));

    try {
      await baseAxios.post(`/dislike-article/${articleId}`, { userId: currentUserId });
    } catch (error) {
      console.error('Error disliking article:', error);
      fetchAllArticles();
    }
  };

  const handleBlockClick = (articleId: string) => {
    setArticleToBlock(articleId);
    setIsBlockModalOpen(true);
  };
  
  const handleBlock = async () => {
    if (!currentUserId || !articleToBlock) return;
    
    updateArticleState(articleToBlock, article => ({
      ...article,
      blocks: [...article.blocks, currentUserId]
    }));
  
    try {
      await baseAxios.post(`/block-article/${articleToBlock}`, { userId: currentUserId });
      setIsBlockModalOpen(false);
      setArticleToBlock(null);
      setSelectedArticle(null)
    } catch (error) {
      console.error('Error blocking article:', error);
      fetchAllArticles();
    }
  };

  const isLiked = (article: Article) => currentUserId ? article.likes.includes(currentUserId) : false;
  const isDisliked = (article: Article) => currentUserId ? article.dislikes.includes(currentUserId) : false;

  const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    const isBlocked = article.blocks?.includes(currentUserId || '');
  
    return (
      <motion.div
        className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="relative h-48">
          <img src={article.image || "/api/placeholder/400/200"} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute top-0 right-0 bg-white bg-opacity-75 p-2 rounded-bl-lg">
            <span className={`text-xs font-semibold flex items-center ${preferences?.includes(article.category) ? 'text-green-600' : 'text-blue-600'}`}>
              <Tag size={12} className="mr-1" /> {article.category}
            </span>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">{article.title}</h2>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.description}</p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
              <span className="flex items-center">
                <User size={12} className="mr-1" /> {article.author}
              </span>
              <span className="flex items-center">
                <Calendar size={12} className="mr-1" /> {new Date(article.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex space-x-4 text-sm">
                <span className="flex items-center text-green-600">
                  <ThumbsUp size={14} className="mr-1" /> {article.likes.length}
                </span>
                <span className="flex items-center text-red-600">
                  <ThumbsDown size={14} className="mr-1" /> {article.dislikes.length}
                </span>
              </div>
            </div>
            {isBlocked ? (
              <button
                disabled
                className="w-full px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold cursor-not-allowed"
              >
                Blocked
              </button>
            ) : (
              <button
                onClick={() => setSelectedArticle(article)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-semibold"
              >
                Read More
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Your Article Feed</h1>
      
      <div className="mb-8 flex justify-center">
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="p-2 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(articles.map(article => article.category))).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentArticles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

          <div className="flex justify-center items-center mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="mx-4 text-gray-700">
              Page {currentPage} of {Math.ceil(filteredAndSortedArticles.length / articlesPerPage)}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastArticle >= filteredAndSortedArticles.length}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">{selectedArticle.title}</h2>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <img src={selectedArticle.image || "/api/placeholder/800/400"} alt={selectedArticle.title} className="w-full h-64 object-cover rounded-lg mb-6" />
                <p className="text-gray-700 mb-6 leading-relaxed">{selectedArticle.content}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar size={16} className="mr-1" /> {new Date(selectedArticle.date).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-blue-500 flex items-center">
                    <Tag size={16} className="mr-1" /> {selectedArticle.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLike(selectedArticle._id)}
                      className={`flex items-center space-x-1 p-2 rounded-full transition-colors ${
                        isLiked(selectedArticle) ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-green-100 hover:text-green-600'
                      }`}
                    >
                      <ThumbsUp size={16} />
                      <span>{selectedArticle.likes.length}</span>
                    </button>
                    <button
                      onClick={() => handleDislike(selectedArticle._id)}
                      className={`flex items-center space-x-1 p-2 rounded-full transition-colors ${
                        isDisliked(selectedArticle) ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      <ThumbsDown size={16} />
                      <span>{selectedArticle.dislikes.length}</span>
                    </button>
                    <button
                     onClick={() => handleBlockClick(selectedArticle._id)}
                      className="flex items-center space-x-1 p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Shield size={16} />
                      <span >Block</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmationModal
  showModal={isBlockModalOpen}
  onClose={() => setIsBlockModalOpen(false)}
  onConfirm={handleBlock}
  message='Are you sure you want to block this article?'
  isDelete={false}
/>
    </div>
  );
};

export default Dashboard;