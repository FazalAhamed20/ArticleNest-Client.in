import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import ConfirmationModal from '../../utils/modal/confirmationModal'; 
import { AppDispatch } from '../../redux/Store';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authAction';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLogout,setIsLogout]=useState(false)
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSignOut = async() => {
    setIsLogout(true)
 try {
  await dispatch(logout());

  setShowModal(false);
  setIsLogout(false)
  navigate('/login', { replace: false });

  
 } catch (error) {
  console.error('Logout failed:', error);
  
 }
 
   
  };

  return (
    <>
      <nav className="bg-gray-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-gray-800 cursor-pointer" onClick={()=>{navigate('/dashboard')}}>Article Nest</span>
              </div>
              <div className="hidden md:block">
               
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <button
                    onClick={toggleProfile}
                    className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <User className="h-6 w-6" /> 
                   
                  </button>
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                      <a href="/article" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Articles</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowModal(true)}>Sign out</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
           
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="ml-auto relative">
                  <button
                    onClick={toggleProfile}
                    className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <User className="h-6 w-6" />
                  </button>
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                      <a href="/article" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Articles</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowModal(true)}>Sign out</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <ConfirmationModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSignOut}
        message='Are you sure you want to sign out'
        isDelete={isLogout}
      />
    </>
  );
};

export default Navbar;
