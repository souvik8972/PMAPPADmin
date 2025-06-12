import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { parseJwt } from '../utils/auth';
import { useRouter } from 'expo-router';

const useTokenExpiryCheck = (token, logout) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  const checkTokenExpiry = async () => { 
    if (!token) return;

    try {
      const decoded = parseJwt(token);
      const currentTime = Date.now() / 1000;
      
    
 
      
      console.log(`Token expiry: ${decoded.exp}, Current time: ${currentTime}`);

      if (decoded?.exp && currentTime > decoded.exp) {
       
        await logout(); // Await the async logout
        router.replace('/login');
      }
      
      // Real check (for production):
      // if (decoded?.exp && decoded.exp < currentTime) {
      //   await logout();
      //   router.replace('/login');
      // }
    } catch (error) {
      console.error('Token decode error:', error);
      await logout();
      router.replace('/login');
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        await checkTokenExpiry(); // Await here too
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [token, logout]);
};

export default useTokenExpiryCheck;