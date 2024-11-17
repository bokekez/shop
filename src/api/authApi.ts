const API_URL = 'https://dummyjson.com/auth/login';

export const loginUser = async (username: string, password: string): Promise<any> => {
  console.log('login', username, password)
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 30, 
      }),
      credentials: 'omit', 
    }); 
  
    if (!response.ok) {
      throw new Error('Failed to login');
    } 

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
