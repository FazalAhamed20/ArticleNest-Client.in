import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/Store';
import baseAxios from '../../config/axiosInstance';

import { Article } from '../../types/userData';
import ArticleList from './ArticleList';
import ArticleModal from '../../utils/modal/ArticalModal';
import Pagination from './Pagination';
import ConfirmationModal from '../../utils/modal/confirmationModal';
import { addArticle } from '../../redux/actions/articleAction';
import { uploadImageToCloudinary } from '../../helper/upload';

const UserArticleManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [isLoading,setIsLoading]=useState(false)
  const [isDelete,setIsDelete]=useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    fetchArticle();
  }, []);

  

  const fetchArticle = async () => {
    try {
      const userId =  useSelector((state: any) => state.auth.user?.user._id);;
      const response = await baseAxios.get('/articles', { params: { userId } });
      setArticles(response.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const openModal = (article: Article | null = null) => {
    setCurrentArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentArticle(null);
    setIsModalOpen(false);
  };

  const handleSave = async (article: Article) => {
    setIsLoading(true)
    let cloudinaryUrl = article.image;
    const userId =  useSelector((state: any) => state.auth.user?.user._id);;

    if (article.image instanceof File) {
      try {
        cloudinaryUrl = await uploadImageToCloudinary(article.image);
      } catch (error) {
        console.error('Image upload failed:', error);
        return;
      }
    }

    const updatedArticle = { ...article, image: cloudinaryUrl, id: userId };
    await dispatch(addArticle(updatedArticle));
    fetchArticle()

    if (article.id) {
      setArticles(articles.map(a => a.id === article.id ? article : a));
    } else {
      setArticles([...articles, { ...article, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    }
    setIsLoading(false)

    closeModal();
  };

  const openDeleteModal = (_id: number) => {
    console.log(_id);
    
    setArticleToDelete(_id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setArticleToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDelete(true)
    console.log(articleToDelete);
    
    if (articleToDelete !== null) {
      
      await baseAxios.delete(`/articles/${articleToDelete}`);
      setArticles(articles.filter(a => a._id !== articleToDelete));
      setIsDelete(false)
      closeDeleteModal();
    }
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Your Articles</h1>
        <button
          onClick={() => openModal()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors flex items-center"
        >
          Add New Article
        </button>
      </div>

      <ArticleList
        articles={currentArticles}
        openModal={openModal}
        openDeleteModal={openDeleteModal}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ArticleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        article={currentArticle}
        isLoading={isLoading}
      />

      <ConfirmationModal
        showModal={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this article? This action cannot be undone."
        isDelete={isDelete}

      />
    </div>
  );
};

export default UserArticleManagement;