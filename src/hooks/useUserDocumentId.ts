import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';

export const useUserDocumentId = () => {
  const [userDocumentId, setUserDocumentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserDocumentId = async () => {
      try {
        // First try to get from AsyncStorage
        const storedId = await AsyncStorage.getItem('user_document_id');
        
        if (storedId) {
          setUserDocumentId(storedId);
        } else {
          // Fallback to Firebase Auth UID
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (currentUser) {
            setUserDocumentId(currentUser.uid);
            // Store it for future use
            await AsyncStorage.setItem('user_document_id', currentUser.uid);
          }
        }
      } catch (error) {
        console.error('Error loading user document ID:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserDocumentId();
  }, []);

  const setUserDocumentIdAndStore = async (id: string) => {
    try {
      await AsyncStorage.setItem('user_document_id', id);
      setUserDocumentId(id);
    } catch (error) {
      console.error('Error storing user document ID:', error);
    }
  };

  const clearUserDocumentId = async () => {
    try {
      await AsyncStorage.removeItem('user_document_id');
      setUserDocumentId(null);
    } catch (error) {
      console.error('Error clearing user document ID:', error);
    }
  };

  return {
    userDocumentId,
    loading,
    setUserDocumentId: setUserDocumentIdAndStore,
    clearUserDocumentId,
  };
}; 