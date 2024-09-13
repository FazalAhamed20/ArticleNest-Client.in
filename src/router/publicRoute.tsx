import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface PublicRouteProps {
  element: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const isLoggedIn = useSelector((state: any) =>state.auth.user?.user.isLogged);
  

 
  if (isLoggedIn) {
    return <Navigate to='/dashboard' />;
  }

  return element;
};

export default PublicRoute;