import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  _id: string;

}

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken._id;
  } catch (error) {
    console.error('Failed to decode access token:', error);
    return null;
  }
};

export default getUserIdFromToken;

export const getUserId = () => {
  const getCookieValue = (name:any) => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')[1];
  };

  const accessToken = getCookieValue('access_token');
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
