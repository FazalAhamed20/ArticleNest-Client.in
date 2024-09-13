import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  _id: string;

}

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    console.log(decodedToken);
    
    return decodedToken._id;
  } catch (error) {
    console.error('Failed to decode access token:', error);
    return null;
  }
};

export default getUserIdFromToken;

export const getUserId = () => {
  const getCookieValue = (name: string): string | undefined => {
    console.log('All cookies:', document.cookie);
    const cookieString = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`));
    console.log(`Cookie string for ${name}:`, cookieString);
    const value = cookieString?.split('=')[1];
    console.log(`Value for ${name}:`, value);
    return value;
  };
  console.log(getCookieValue);
  

  const accessToken = getCookieValue('access_token');
  console.log("accessToken",accessToken);
  
  if (accessToken) {
    return getUserIdFromToken(accessToken);
  }

  const refreshToken = getCookieValue('refresh_token');
  if (refreshToken) {
    return getUserIdFromToken(refreshToken);
  }

  console.error('No access token or refresh token found in cookies.');
  return null;
};
