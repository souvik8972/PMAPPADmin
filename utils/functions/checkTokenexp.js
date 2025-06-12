import { router } from 'expo-router';

export const isTokenValid = async (user, logout) => {
  try {
    // No user or no expiration time
    if (!user?.exp) return false;

    const currentTime = Date.now() / 1000;
    const bufferTime = 10; // 10 seconds buffer for clock skew
    
    // Token is still valid (with buffer time)
    if (currentTime < user.exp - bufferTime) return true;

    // Token expired
    await logout();
    router.replace('/login');
    return false;
  } catch (error) {
   console.log("Error checking token validity:", error);
    return false; // Fail-safe
  }
};