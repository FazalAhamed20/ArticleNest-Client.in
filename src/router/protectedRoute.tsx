  // src/routes/PrivateRoute.tsx

  import React from 'react';
  import { Navigate } from 'react-router-dom';
  import { useSelector } from 'react-redux';

  interface PrivateRouteProps {
    element: React.ReactElement;
    
  }

  const PrivateRoute: React.FC<PrivateRouteProps> = ({
    element,
  
  }) => {
    const isLoggedIn = useSelector((state: any) => state.auth.user?.user.isLogged);

    console.log(isLoggedIn);
    
  



    if (!isLoggedIn ) {
      return <Navigate to='/login' />;
    }

  
    return element;
  };

  export default PrivateRoute;