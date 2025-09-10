import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { auth } from "../../../../firebaseConfig";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  userDocumentId: string | null;
  setUserDocumentId: (id: string) => Promise<void>;
  clearUserDocumentId: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userDocumentId: null,
  setUserDocumentId: async () => {},
  clearUserDocumentId: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDocumentId, setUserDocumentIdState] = useState<string | null>(null);

  const setUserDocumentId = async (id: string) => {
    try {
      await AsyncStorage.setItem('user_document_id', id);
      setUserDocumentIdState(id);
    } catch (error) {
      console.error('Error storing user document ID:', error);
    }
  };

  const clearUserDocumentId = async () => {
    try {
      await AsyncStorage.removeItem('user_document_id');
      setUserDocumentIdState(null);
    } catch (error) {
      console.error('Error clearing user document ID:', error);
    }
  };

  useEffect(() => {
    let logoutTimeout: NodeJS.Timeout | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        
        await AsyncStorage.setItem("hasSetup", "true");

        
        const oneHour = 60 * 60 * 1000;
        const expiresAt = Date.now() + oneHour;
        await AsyncStorage.setItem("sessionExpiresAt", expiresAt.toString());

        
        try {
          const storedId = await AsyncStorage.getItem('user_document_id');
          if (storedId) {
            setUserDocumentIdState(storedId);
          } else {
            
            await setUserDocumentId(firebaseUser.uid);
          }
        } catch (error) {
          console.error('Error handling user document ID:', error);
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem("sessionExpiresAt");
        await clearUserDocumentId();
      }
      setLoading(false);
    });

    
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        
        if (logoutTimeout) {
          clearTimeout(logoutTimeout);
        }

        
        logoutTimeout = setTimeout(async () => {
          await AsyncStorage.removeItem("sessionExpiresAt");
          await clearUserDocumentId();
          setUser(null);
        }, 60000); 
      } else if (nextAppState === 'active') {
        
        if (logoutTimeout) {
          clearTimeout(logoutTimeout);
          logoutTimeout = null;
        }
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      unsubscribe();
      appStateSubscription.remove();
      if (logoutTimeout) {
        clearTimeout(logoutTimeout);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      userDocumentId, 
      setUserDocumentId, 
      clearUserDocumentId 
    }}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;
