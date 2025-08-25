import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { parseJwt } from '../utils/auth';
import { useRouter } from 'expo-router';

/**
 * Custom hook to check JWT token expiry when the app comes to foreground
 * @param {string} token - The JWT token to validate
 * @param {function} logout - Async function to handle user logout
 */
const useTokenExpiryCheck = (token, logout) => {
  // Store current app state for comparison
  const appState = useRef(AppState.currentState);
  
  // Router instance for navigation
  const router = useRouter();

  /**
   * Function to check if the token has expired
   * If expired, logs out user and redirects to login page
   */
  const checkTokenExpiry = async () => { 
    // Early return if no token is provided
    if (!token) return;

    try {
      // Parse the JWT token to extract payload
      const decoded = parseJwt(token);
      
      // Get current time in seconds (JWT exp is in seconds since epoch)
      const currentTime = Date.now() / 1000;
      
      // Debug logging - shows token expiry and current time
      console.log(`Token expiry: ${decoded.exp}, Current time: ${currentTime}`);

      // Check if token has expired (current time is past expiry)
      if (decoded?.exp && currentTime > decoded.exp) {
        // Token is expired, execute logout process
        await logout(); // Await the async logout
        
        // Redirect to login page after logout
        router.replace('/login');
      }
      
      // Real check (for production):
      // if (decoded?.exp && decoded.exp < currentTime) {
      //   await logout();
      //   router.replace('/login');
      // }
    } catch (error) {
      // If token parsing fails, treat as invalid token and logout
      console.error('Token decode error:', error);
      await logout();
      router.replace('/login');
    }
  };

  // Effect to set up app state change listener
  useEffect(() => {
    // Subscribe to app state changes (foreground/background)
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      // Check if app is coming from background to foreground
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App is now active (in foreground), check token validity
        await checkTokenExpiry(); // Await here too
      }
      
      // Update current app state reference
      appState.current = nextAppState;
    });

    // Cleanup: remove subscription when component unmounts
    return () => subscription.remove();
  }, [token, logout]); // Re-run effect if token or logout function changes
};

export default useTokenExpiryCheck;