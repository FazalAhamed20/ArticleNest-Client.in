export const getUserId = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://articlenest-serverin-production.up.railway.app/api/get-user-id', {
      credentials: 'include', // This is crucial for sending cookies
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user ID');
    }

    const data = await response.json();
    return data.userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};