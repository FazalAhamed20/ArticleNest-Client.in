import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaCalendar, FaEdit, FaBook, FaHeart, FaLock, FaUnlock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/Store';
import { resetPassword } from '../../redux/actions/authAction';

import EditProfileModal from '../../utils/modal/EditProfileModal';
import {  useNavigate } from 'react-router-dom';
import baseAxios from '../../config/axiosInstance';
import ConfirmationModal from '../../utils/modal/confirmationModal';

interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
}
interface BlockedArticle {
  description: string;
  id: number;
  title: string;
}

const ChangePasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const dispatch: AppDispatch = useDispatch();
 

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const userId =   useSelector((state: any) => state.auth.user?.user._id)
    console.log(userId);
    
    await dispatch(resetPassword({ oldPassword, newPassword, userId }))
    console.log('Changing password:', { oldPassword, newPassword });
    clearAndClose();
  };

  const clearAndClose = () => {
    setOldPassword('');
    setNewPassword('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setOldPassword('');
      setNewPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="oldPassword" className="block text-gray-700 mb-2">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={clearAndClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-gray-500 text-white rounded">Change Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserProfilePage: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user?.user);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [blockedArticles, setBlockedArticles] = useState<BlockedArticle[]>([]);
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);
  const [articleToUnblock, setArticleToUnblock] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
    fetchBlockedArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const userId =   useSelector((state: any) => state.auth.user?.user._id);
      const response = await baseAxios.get('/articles', { params: { userId } });
      const sortedArticles = response.data.data.sort((a: Article, b: Article) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setArticles(sortedArticles.slice(0, 3));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchBlockedArticles = async () => {
    try {
      const userId = useSelector((state: any) => state.auth.user?.user._id);
      const response = await baseAxios.get('/blocked-articles', { params: { userId } });
      console.log("blocked ",response);
      
      setBlockedArticles(response.data.data);
    } catch (error) {
      console.error('Error fetching blocked articles:', error);
    }
  };

  const handleUnblockClick = (articleId: number) => {
    setArticleToUnblock(articleId);
    setIsUnblockModalOpen(true);
  };

  const handleUnblock = async () => {
    if (articleToUnblock === null) return;

    try {
      const userId = useSelector((state: any) => state.auth.user?.user._id);
      await baseAxios.post(`/unblock-article/${articleToUnblock}`, { userId });
      setBlockedArticles(blockedArticles.filter(article => article.id !== articleToUnblock));
      setIsUnblockModalOpen(false);
      setArticleToUnblock(null);
    } catch (error) {
      console.error('Error unblocking article:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="md:col-span-1 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">{`${user.firstName} ${user.lastName}`}</h2>
                  <button 
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setIsEditProfileModalOpen(true)}
                    title="Edit Profile"
                  >
                    <FaEdit className="text-xl" />
                  </button>
                </div>
                <div className="mt-2">
                  <button 
                    className="flex items-center px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                  >
                    <FaLock className="mr-2" /> Change Password
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2 text-gray-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-2 text-gray-500" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendar className="mr-2 text-gray-500" />
                  <span>{new Date(user.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.map((preference: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                        <FaHeart className="mr-1 text-blue-500" />
                        {preference}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Articles */}
          <div className="md:col-span-2 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Articles</h2>
              <div className="space-y-6">
                {articles.map((article) => (
                  <div key={article.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">{article.title}</h3>
                    <p className="text-gray-600 mb-2">{article.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendar className="mr-2" />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              onClick={()=>{navigate('/article')}}>
                <FaBook className="mr-2" /> View All Articles
              </button>
            </div>
          </div>
          <div className="md:col-span-3 bg-white shadow-md rounded-lg overflow-hidden mt-6">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Blocked Articles</h2>
              {blockedArticles.length === 0 ? (
                <p className="text-gray-600">No blocked articles.</p>
              ) : (
                <div className="space-y-4">
      {blockedArticles.map((article) => (
        <div key={article.id} className="flex flex-col border-b border-gray-200 pb-4 last:border-b-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-700">{article.title}</h3>
            <button
              onClick={() => handleUnblockClick(article.id)}
              className="flex items-center px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <FaUnlock className="mr-2" /> Unblock
            </button>
          </div>
          <p className="text-gray-600">{article.description}</p>
        </div>
      ))}
    </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen} 
        onClose={() => setIsChangePasswordModalOpen(false)} 
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={user}
      />
      <ConfirmationModal
        showModal={isUnblockModalOpen}
        onClose={() => setIsUnblockModalOpen(false)}
        onConfirm={handleUnblock}
        message='Are you sure you want to unblock the article'
        isDelete={false}
      />
    </div>
  );
};

export default UserProfilePage;