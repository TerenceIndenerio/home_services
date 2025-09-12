import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/firebaseConfig';

/**
 * Utility function for logging out.
 * Note: For better state management, consider using the logout method from AuthContext instead.
 */
export const logout = async () => {
  try {
    await signOut(auth);

    await AsyncStorage.multiRemove([
      'user_document_id',
      'sessionExpiresAt',
      'user_names',
      'hasSetup'
    ]);

    console.log('Logout successful');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};