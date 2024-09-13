import React, { lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './protectedRoute';
import PublicRoute from './publicRoute';


const SignupPage=lazy(()=> import('../components/signup/Signup'))
const LoginPage=lazy(()=> import('../components/login/Login'))
const DashboardPage=lazy(()=> import('../pages/dashboardPage/dashboardPage'))
const ProfilePage=lazy(()=> import('../pages/profilePage/ProfilePage'))
const UserArticleManagement=lazy(()=> import('../pages/articlePage/ArticlePage'))


const RouteConfig: React.FC = () => {
    return (
      <Routes>
      
  
        {/* Private Routes */}
        <Route
          path='/dashboard'
          element={<PrivateRoute element={<DashboardPage />} />}
        />
        <Route
          path='/profile'
          element={<PrivateRoute element={<ProfilePage />} />}
        />
        <Route
          path='/article'
          element={<PrivateRoute element={<UserArticleManagement />} />}
        />
       
        {/* Public Routes */}
        <Route path='/' element={<PublicRoute element={<SignupPage />} />} />
        <Route
          path='/login'
          element={<PublicRoute element={<LoginPage />} />}
        />
       
  
        {/* Catch-all route */}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    );
  };
  
  export default RouteConfig;