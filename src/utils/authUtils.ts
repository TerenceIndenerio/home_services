import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/firebaseConfig';

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